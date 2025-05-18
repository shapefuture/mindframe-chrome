
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
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Check for parser errors
    const parserError = xmlDoc.getElementsByTagName("parsererror");
    if (parserError.length > 0) {
      console.error("XML Parsing Error:", parserError[0].textContent);
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

    // Validate required fields
    if (!insight.pattern_type || !insight.explanation || !insight.micro_challenge_prompt) {
      return null;
    }

    return insight;
  } catch (error) {
    console.error("Error parsing XML response:", error);
    return null;
  }
}

async function sendInsightToContentScript(
  tabId: number,
  insight: LLMInsight
): Promise<void> {
  try {
    await chrome.tabs.sendMessage(tabId, {
      action: 'showMindframeCoPilotInsight',
      payload: { insight }
    });
  } catch (error) {
    console.error('Error sending insight to content script:', error);
  }
}

async function getRandomOfflineInsight(): Promise<LLMInsight> {
  const randomIndex = Math.floor(Math.random() * commonOfflineInsights.length);
  return {
    ...commonOfflineInsights[randomIndex],
    original_text_segment: ''
  };
}

// Message handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
  if (!tabId) return;

  try {
    const storeState = await MindframeStore.get();
    if (!storeState.profile) return;

    const cacheKey = hashString(payload.visibleText + storeState.profile.primaryGoal + payload.pageUrl);
    const cachedItem = insightCache[cacheKey];

    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
      await sendInsightToContentScript(tabId, cachedItem.insight);
      return;
    }

    try {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlResponse = await response.text();
      const parsedInsight = await parseXMLResponse(xmlResponse);

      if (parsedInsight) {
        insightCache[cacheKey] = {
          insight: parsedInsight,
          timestamp: Date.now()
        };
        await sendInsightToContentScript(tabId, parsedInsight);
      } else {
        const offlineInsight = await getRandomOfflineInsight();
        await sendInsightToContentScript(tabId, offlineInsight);
      }
    } catch (error) {
      console.error('Error calling LLM service:', error);
      const offlineInsight = await getRandomOfflineInsight();
      await sendInsightToContentScript(tabId, offlineInsight);
    }
  } catch (error) {
    console.error('Error in handleAnalyzeRequest:', error);
  }
}

async function handleChallengeAccepted(
  payload: { challengePrompt: string; hcRelated: string | null }
): Promise<void> {
  const WXP_FOR_CHALLENGE = 15;

  try {
    await GamificationService.addWXP(WXP_FOR_CHALLENGE);
    
    await MindframeStore.update(current => ({
      completedChallengeLog: [
        {
          timestamp: Date.now(),
          challengeText: payload.challengePrompt,
          hcRelated: payload.hcRelated || "General",
          wxpEarned: WXP_FOR_CHALLENGE
        },
        ...current.completedChallengeLog.slice(0, 19)
      ]
    }));
  } catch (error) {
    console.error('Error handling challenge acceptance:', error);
  }
}
