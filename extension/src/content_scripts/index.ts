
import { LLMInsight } from '../core_logic/types';
import { InsightCard } from '../ui_components/InsightCard';
import React from 'react';
import ReactDOM from 'react-dom/client';

const MIN_RELEVANT_LENGTH = 150;
let insightRoot: ReactDOM.Root | null = null;

function isAnalyzableElement(element: Element): boolean {
  const validTags = ['P', 'LI', 'ARTICLE', 'SECTION', 'MAIN'];
  if (!validTags.includes(element.tagName)) return false;

  const isVisible = element.offsetWidth > 0 || 
                   element.offsetHeight > 0 || 
                   element.getClientRects().length > 0;
  if (!isVisible) return false;

  const text = element.textContent?.trim() || '';
  return text.length >= MIN_RELEVANT_LENGTH;
}

function createInsightContainer(): HTMLElement {
  const container = document.createElement('div');
  container.id = 'mindframe-insight-container';
  document.body.appendChild(container);
  return container;
}

function showInsight(insight: LLMInsight) {
  const container = document.getElementById('mindframe-insight-container') || createInsightContainer();
  
  if (!insightRoot) {
    insightRoot = ReactDOM.createRoot(container);
  }

  const handleAccept = (challengePrompt: string, hcRelated: string | null) => {
    chrome.runtime.sendMessage({
      action: 'coPilotChallengeAccepted',
      payload: { challengePrompt, hcRelated }
    });
    handleDismiss();
  };

  const handleDismiss = () => {
    if (insightRoot) {
      insightRoot.unmount();
      insightRoot = null;
    }
    container.remove();
  };

  if (insight.highlight_suggestion_css_selector) {
    try {
      const elements = document.querySelectorAll(insight.highlight_suggestion_css_selector);
      elements.forEach(el => el.classList.add('mindframe-highlight'));
    } catch (error) {
      console.error('Invalid CSS selector:', error);
    }
  }

  insightRoot.render(
    React.createElement(InsightCard, {
      insight,
      onAccept: handleAccept,
      onDismiss: handleDismiss
    })
  );
}

let analyzeTimeout: NodeJS.Timeout;
const observer = new MutationObserver(() => {
  clearTimeout(analyzeTimeout);
  analyzeTimeout = setTimeout(analyzeVisibleText, 1000);
});

function analyzeVisibleText() {
  const elements = document.querySelectorAll('p, li, article, section, main');
  let collectedText = '';

  elements.forEach(element => {
    if (isAnalyzableElement(element)) {
      collectedText += element.textContent?.trim() + '\n';
    }
  });

  if (collectedText.length > 0) {
    chrome.runtime.sendMessage({
      action: 'analyzeVisibleTextForCoPilot',
      payload: {
        visibleText: collectedText.slice(0, 1000),
        pageUrl: window.location.href
      }
    });
  }
}

// Listen for insights from the service worker
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'showMindframeCoPilotInsight') {
    showInsight(message.payload);
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial analysis
analyzeVisibleText();

// Add highlight styles
const style = document.createElement('style');
style.textContent = `
  .mindframe-highlight {
    background-color: rgba(255, 255, 0, 0.3);
    transition: background-color 0.3s ease;
  }
`;
document.head.appendChild(style);
