
import React from 'react';
import { createRoot } from 'react-dom/client';
import InsightCard from '../ui_components/InsightCard';
import type { LLMInsight } from '../core_logic/types';

class ContinuousContextMonitor {
  private static MIN_RELEVANT_LENGTH = 150;
  private observer: MutationObserver | null = null;
  private lastAnalyzedText: string = '';
  private debounceTimeout: number | null = null;

  constructor() {
    console.debug('[ContentScript/ContinuousContextMonitor] Constructor');
    try {
      this.observer = new MutationObserver(this.handleMutations.bind(this));
    } catch (err) {
      console.error('[ContentScript/ContinuousContextMonitor] Error constructing MutationObserver:', err);
    }
  }

  start() {
    console.debug('[ContentScript/ContinuousContextMonitor] start()');
    try {
      if (this.observer) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
        console.debug('[ContentScript/ContinuousContextMonitor] MutationObserver started');
      }
    } catch (err) {
      console.error('[ContentScript/ContinuousContextMonitor] Error starting observer:', err);
    }
  }

  stop() {
    console.debug('[ContentScript/ContinuousContextMonitor] stop()');
    try {
      if (this.observer) {
        this.observer.disconnect();
        console.debug('[ContentScript/ContinuousContextMonitor] MutationObserver disconnected');
      }
    } catch (err) {
      console.error('[ContentScript/ContinuousContextMonitor] Error stopping observer:', err);
    }
  }

  private isAnalyzableElement(element: Element): boolean {
    const validTags = ['P', 'LI', 'ARTICLE', 'SECTION', 'MAIN'];
    if (!validTags.includes(element.tagName)) return false;

    const isVisible = element.offsetWidth > 0 ||
      element.offsetHeight > 0 ||
      element.getClientRects().length > 0;

    const hasContent = (element.textContent?.trim().length ?? 0) > ContinuousContextMonitor.MIN_RELEVANT_LENGTH;

    return isVisible && hasContent;
  }

  private handleMutations(mutations: MutationRecord[]) {
    // Verbose logging
    console.debug('[ContentScript/ContinuousContextMonitor] handleMutations - number of mutations:', mutations.length);
    if (this.debounceTimeout) {
      window.clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = window.setTimeout(() => {
      try {
        const visibleText = this.collectVisibleText();
        if (visibleText && visibleText !== this.lastAnalyzedText) {
          console.debug('[ContentScript/ContinuousContextMonitor] Detected new visibleText for analysis');
          this.lastAnalyzedText = visibleText;
          this.analyzeVisibleTextForCoPilot(visibleText);
        }
      } catch (err) {
        console.error('[ContentScript/ContinuousContextMonitor] Error during text analysis:', err);
      }
    }, 1000);
  }

  private collectVisibleText(): string {
    console.debug('[ContentScript/ContinuousContextMonitor] collectVisibleText');
    const texts: string[] = [];
    try {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT
      );

      let node: Element | null = walker.currentNode as Element;
      while (node) {
        if (this.isAnalyzableElement(node)) {
          texts.push(node.textContent?.trim() ?? '');
        }
        node = walker.nextNode() as Element;
      }
    } catch (err) {
      console.error('[ContentScript/ContinuousContextMonitor] Error collecting visible text:', err);
    }
    return texts.join(' ').slice(0, 1000);
  }

  private async analyzeVisibleTextForCoPilot(visibleText: string) {
    console.debug('[ContentScript/ContinuousContextMonitor] analyzeVisibleTextForCoPilot - visibleText:', visibleText);
    try {
      chrome.runtime.sendMessage({
        action: 'analyzeVisibleTextForCoPilot',
        payload: {
          visibleText,
          pageUrl: window.location.href
        }
      });
      console.debug('[ContentScript/ContinuousContextMonitor] Sent analyzeVisibleTextForCoPilot message');
    } catch (err) {
      console.error('[ContentScript/ContinuousContextMonitor] Error sending message:', err);
    }
  }
}

// Initialize insight card container
function createInsightContainer(): HTMLElement {
  console.debug('[ContentScript] Creating insight container');
  const container = document.createElement('div');
  container.id = 'mindframe-insight-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
}

// Handle insight display
function showInsight(insight: LLMInsight) {
  console.debug('[ContentScript] showInsight called with:', insight);
  let container = document.getElementById('mindframe-insight-container');
  if (!container) {
    container = createInsightContainer();
  }

  const root = createRoot(container);

  const handleAccept = async (challengePrompt: string, hcRelated: string | null) => {
    console.debug('[ContentScript] User accepted challenge:', challengePrompt, hcRelated);
    try {
      chrome.runtime.sendMessage({
        action: 'coPilotChallengeAccepted',
        payload: { challengePrompt, hcRelated }
      });
      root.unmount();
    } catch (err) {
      console.error('[ContentScript] Error sending coPilotChallengeAccepted:', err);
    }
  };

  const handleDismiss = () => {
    console.debug('[ContentScript] User dismissed insight card');
    root.unmount();
  };

  try {
    root.render(
      <InsightCard
        insight={insight}
        onAccept={handleAccept}
        onDismiss={handleDismiss}
      />
    );
    if (insight.highlight_suggestion_css_selector) {
      try {
        const elements = document.querySelectorAll(insight.highlight_suggestion_css_selector);
        elements.forEach(el => {
          el.classList.add('mindframe-highlight');
        });
        console.debug('[ContentScript] Applied highlight to selector:', insight.highlight_suggestion_css_selector);
      } catch (error) {
        console.error('[ContentScript] Invalid CSS selector for highlight:', error);
      }
    }
  } catch (err) {
    console.error('[ContentScript] Error rendering InsightCard or applying highlight:', err);
  }
}

// Initialize
try {
  const monitor = new ContinuousContextMonitor();
  monitor.start();
  console.debug('[ContentScript] ContinuousContextMonitor started');
} catch (err) {
  console.error('[ContentScript] Error initializing ContinuousContextMonitor:', err);
}

// Listen for messages from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.debug('[ContentScript] Received message:', message, 'from:', sender);
  try {
    if (message.action === 'showMindframeCoPilotInsight') {
      showInsight(message.payload.insight);
    }
  } catch (err) {
    console.error('[ContentScript] Error handling incoming message:', err);
  }
  return true;
});
