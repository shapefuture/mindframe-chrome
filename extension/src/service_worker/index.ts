
import MindframeStore from '../core_logic/MindframeStore';
import GamificationService from '../core_logic/gamificationService';
import { commonOfflineInsights } from '../assets/data/common_offline_insights_data';
import type { LLMInsight } from '../core_logic/types';

interface InsightCache {
  [key: string]: {
    insight: LLMInsight;
    timestamp: number;
  };
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const insightCache: InsightCache = {};

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

async function parseXMLResponse(xmlString: string): Promise<LLMInsight | null> {
  console.debug("[service_worker/parseXMLResponse] Parsing XML:", xmlString);
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const parserError = xmlDoc.getElementsByTagName("parsererror");
    if (parserError.length > 0) {
      console.error("[service_worker/parseXMLResponse] XML Parsing Error:", parserError[0].textContent);
      return null;
    }
    const getString = (tagName: string) =>
      xmlDoc.getElementsByTagName(tagName)[0]?.textContent?.trim() || "";

    const insight: LLMInsight = {
      pattern_type: getString("pattern_type"),
      hc_related: getString("hc_related") || null,
      explanation: getString("explanation"),
      micro_challenge_prompt: getString("micro_challenge_prompt"),
      highlight_suggestion_css_selector: getString("highlight_suggestion_css_selector") || null,
      original_text_segment: getString("original_text_segment"),
    };

    if (!insight.pattern_type || !insight.explanation || !insight.micro_challenge_prompt) {
      console.warn("[service_worker/parseXMLResponse] Missing required fields in parsed insight:", insight);
      return null;
    }
    console.debug("[service_worker/parseXMLResponse] Parsed insight:", insight);
    return insight;
  } catch (error) {
    console.error("[service_worker/parseXMLResponse] Error parsing XML response:", error);
    return null;
  }
}

async function sendInsightToContentScript(
  tabId: number,
  insight: LLMInsight
): Promise<void> {
  console.debug(`[service_worker/sendInsightToContentScript] Sending insight to tabId=${tabId}:`, insight);
  try {
    await chrome.tabs.sendMessage(tabId, {
      action: 'showMindframeCoPilotInsight',
      payload: { insight }
    });
    console.debug(`[service_worker/sendInsightToContentScript] Message sent to content script.`);
  } catch (error) {
    console.error('[service_worker/sendInsightToContentScript] Error sending insight:', error);
  }
}

async function getRandomOfflineInsight(): Promise<LLMInsight> {
  const randomIndex = Math.floor(Math.random() * commonOfflineInsights.length);
  const offline = {
    ...commonOfflineInsights[randomIndex],
    original_text_segment: ''
  };
  console.debug("[service_worker/getRandomOfflineInsight] Returning random offline insight:", offline);
  return offline;
}

// Message handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.debug('[service_worker/onMessage] Received message:', message, 'from sender:', sender);
  if (message.action === 'analyzeVisibleTextForCoPilot') {
    handleAnalyzeRequest(message.payload, sender.tab?.id);
  } else if (message.action === 'coPilotChallengeAccepted') {
    handleChallengeAccepted(message.payload);
  }
  return true;
});

async function handleAnalyzeRequest(
  payload: { visibleText: string; pageUrl: string },
  tabId?: number
): Promise<void> {
  console.debug('[service_worker/handleAnalyzeRequest] Received payload:', payload, 'for tabId:', tabId);
  if (!tabId) {
    console.warn('[service_worker/handleAnalyzeRequest] No tabId provided. Aborting.');
    return;
  }

  try {
    const storeState = await MindframeStore.get();
    if (!storeState.profile) {
      console.warn('[service_worker/handleAnalyzeRequest] No user profile found. Aborting.');
      return;
    }

    const cacheKey = hashString(payload.visibleText + storeState.profile.primaryGoal + payload.pageUrl);
    const cachedItem = insightCache[cacheKey];

    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
      console.info('[service_worker/handleAnalyzeRequest] Cache hit. Returning cached insight.');
      await sendInsightToContentScript(tabId, cachedItem.insight);
      return;
    }

    try {
      console.debug('[service_worker/handleAnalyzeRequest] Fetching LLM insight from worker proxy...');
      const response = await fetch('https://your-worker-url.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textSegment: payload.visibleText,
          userGoal: storeState.profile.primaryGoal
        })
      });

      if (!response.ok) {
        const errMsg = `HTTP error! status: ${response.status}`;
        console.error('[service_worker/handleAnalyzeRequest] LLM worker fetch failed:', errMsg);
        throw new Error(errMsg);
      }

      const xmlResponse = await response.text();
      console.debug('[service_worker/handleAnalyzeRequest] LLM worker returned:', xmlResponse);
      const parsedInsight = await parseXMLResponse(xmlResponse);

      if (parsedInsight) {
        insightCache[cacheKey] = {
          insight: parsedInsight,
          timestamp: Date.now()
        };
        await sendInsightToContentScript(tabId, parsedInsight);
      } else {
        console.warn('[service_worker/handleAnalyzeRequest] LLM insight parsing failed. Falling back to offline insight.');
        const offlineInsight = await getRandomOfflineInsight();
        await sendInsightToContentScript(tabId, offlineInsight);
      }
    } catch (error) {
      console.error('[service_worker/handleAnalyzeRequest] Error calling LLM service:', error);
      const offlineInsight = await getRandomOfflineInsight();
      await sendInsightToContentScript(tabId, offlineInsight);
    }
  } catch (error) {
    console.error('[service_worker/handleAnalyzeRequest] Error in handler:', error);
  }
}

async function handleChallengeAccepted(
  payload: { challengePrompt: string; hcRelated: string | null }
): Promise<void> {
  const WXP_FOR_CHALLENGE = 15;
  console.debug('[service_worker/handleChallengeAccepted] Handling challenge acceptance:', payload);

  try {
    await GamificationService.addWXP(WXP_FOR_CHALLENGE);
    await MindframeStore.update(current => {
      const updatedLog = [
        {
          timestamp: Date.now(),
          challengeText: payload.challengePrompt,
          hcRelated: payload.hcRelated || "General",
          wxpEarned: WXP_FOR_CHALLENGE
        },
        ...(current.completedChallengeLog || []).slice(0, 19)
      ];
      console.debug('[service_worker/handleChallengeAccepted] Updated challenge log:', updatedLog);
      return { completedChallengeLog: updatedLog };
    });
    console.info('[service_worker/handleChallengeAccepted] Challenge accepted and logged.');
  } catch (error) {
    console.error('[service_worker/handleChallengeAccepted] Error handling challenge acceptance:', error);
  }
}
