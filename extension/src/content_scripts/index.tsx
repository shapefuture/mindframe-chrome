
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
    this.observer = new MutationObserver(this.handleMutations.bind(this));
  }

  start() {
    if (this.observer) {
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private isAnalyzableElement(element: Element): boolean {
    const validTags = ['P', 'LI', 'ARTICLE', 'SECTION', 'MAIN'];
    if (!validTags.includes(element.tagName)) return false;

    const isVisible = element.offsetWidth > 0 || 
                     element.offsetHeight > 0 || 
                     element.getClientRects().length > 0;
    
    const hasContent = element.textContent?.trim().length ?? 0 > this.MIN_RELEVANT_LENGTH;
    
    return isVisible && hasContent;
  }

  private handleMutations(mutations: MutationRecord[]) {
    if (this.debounceTimeout) {
      window.clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = window.setTimeout(() => {
      const visibleText = this.collectVisibleText();
      if (visibleText && visibleText !== this.lastAnalyzedText) {
        this.lastAnalyzedText = visibleText;
        this.analyzeVisibleTextForCoPilot(visibleText);
      }
    }, 1000);
  }

  private collectVisibleText(): string {
    const texts: string[] = [];
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

    return texts.join(' ').slice(0, 1000);
  }

  private async analyzeVisibleTextForCoPilot(visibleText: string) {
    chrome.runtime.sendMessage({
      action: 'analyzeVisibleTextForCoPilot',
      payload: {
        visibleText,
        pageUrl: window.location.href
      }
    });
  }
}

// Initialize insight card container
function createInsightContainer(): HTMLElement {
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
  let container = document.getElementById('mindframe-insight-container');
  if (!container) {
    container = createInsightContainer();
  }

  const root = createRoot(container);
  
  const handleAccept = async (challengePrompt: string, hcRelated: string | null) => {
    chrome.runtime.sendMessage({
      action: 'coPilotChallengeAccepted',
      payload: { challengePrompt, hcRelated }
    });
    root.unmount();
  };

  const handleDismiss = () => {
    root.unmount();
  };

  root.render(
    <InsightCard
      insight={insight}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
    />
  );

  // Apply highlight if selector is provided
  if (insight.highlight_suggestion_css_selector) {
    try {
      const elements = document.querySelectorAll(insight.highlight_suggestion_css_selector);
      elements.forEach(el => {
        el.classList.add('mindframe-highlight');
      });
    } catch (error) {
      console.error('Invalid CSS selector:', error);
    }
  }
}

// Initialize
const monitor = new ContinuousContextMonitor();
monitor.start();

// Listen for messages from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showMindframeCoPilotInsight') {
    showInsight(message.payload.insight);
  }
  return true;
});
