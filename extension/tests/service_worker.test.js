/**
 * @jest-environment jsdom
 */

// Mocking chrome APIs and fetch for service_worker
const tabsSendMessageMock = jest.fn();
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    }
  },
  tabs: {
    sendMessage: tabsSendMessageMock
  }
};

global.fetch = jest.fn();

import * as ServiceWorker from '../src/service_worker/index';

describe('service_worker', () => {
  beforeEach(() => {
    tabsSendMessageMock.mockClear();
    fetch.mockClear();
  });

  it('should hash string consistently', () => {
    const hash1 = ServiceWorker.__get__('hashString')('abc');
    const hash2 = ServiceWorker.__get__('hashString')('abc');
    expect(hash1).toBe(hash2);
  });

  it('should parse XML response for valid LLMInsight', async () => {
    const xml = `
      <root>
        <pattern_type>Test</pattern_type>
        <hc_related>critical_thinking</hc_related>
        <explanation>Explain</explanation>
        <micro_challenge_prompt>Challenge</micro_challenge_prompt>
        <highlight_suggestion_css_selector>.foo</highlight_suggestion_css_selector>
        <original_text_segment>Seg</original_text_segment>
      </root>
    `;
    const parsed = await ServiceWorker.__get__('parseXMLResponse')(xml);
    expect(parsed).toMatchObject({
      pattern_type: 'Test',
      hc_related: 'critical_thinking',
      explanation: 'Explain',
      micro_challenge_prompt: 'Challenge',
      highlight_suggestion_css_selector: '.foo',
      original_text_segment: 'Seg'
    });
  });

  it('should return null for malformed XML', async () => {
    const xml = `<root><pattern_type>Test</pattern_type></root>`;
    const parsed = await ServiceWorker.__get__('parseXMLResponse')(xml);
    expect(parsed).toBeNull();
  });

  it('should cache insight and use the cache', async () => {
    // Prepare store and cache
    const state = {
      profile: { primaryGoal: 'goal' }
    };
    ServiceWorker.__set__('insightCache', {}); // Clear cache

    // Mock MindframeStore.get to return state
    ServiceWorker.__set__('MindframeStore', { get: jest.fn().mockResolvedValue(state) });

    // Mock sendInsightToContentScript to track calls
    const sendInsightMock = jest.fn();
    ServiceWorker.__set__('sendInsightToContentScript', sendInsightMock);

    // First call: not cached, triggers fetch and stores insight
    const insight = { pattern_type: 'Test', hc_related: 'c', explanation: 'e', micro_challenge_prompt: 'm', highlight_suggestion_css_selector: null, original_text_segment: 'o' };
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => `<root>
        <pattern_type>Test</pattern_type>
        <hc_related>c</hc_related>
        <explanation>e</explanation>
        <micro_challenge_prompt>m</micro_challenge_prompt>
        <highlight_suggestion_css_selector></highlight_suggestion_css_selector>
        <original_text_segment>o</original_text_segment>
      </root>`
    });
    await ServiceWorker.__get__('handleAnalyzeRequest')({ visibleText: 'abc', pageUrl: 'http://x' }, 1);
    expect(sendInsightMock).toHaveBeenCalled();

    // Second call: should use the cache
    sendInsightMock.mockClear();
    await ServiceWorker.__get__('handleAnalyzeRequest')({ visibleText: 'abc', pageUrl: 'http://x' }, 1);
    expect(sendInsightMock).toHaveBeenCalled(); // Should still call, but now from cache
  });

  it('should handle LLM fetch error and fall back to offline insight', async () => {
    ServiceWorker.__set__('MindframeStore', { get: jest.fn().mockResolvedValue({ profile: { primaryGoal: 'goal' } }) });
    ServiceWorker.__set__('getRandomOfflineInsight', jest.fn().mockResolvedValue({ pattern_type: 'Offline', hc_related: null, explanation: 'Fallback', micro_challenge_prompt: 'Do this', highlight_suggestion_css_selector: null, original_text_segment: '' }));
    ServiceWorker.__set__('sendInsightToContentScript', jest.fn());
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await ServiceWorker.__get__('handleAnalyzeRequest')({ visibleText: 'error', pageUrl: 'url' }, 2);
    expect(ServiceWorker.__get__('getRandomOfflineInsight')).toHaveBeenCalled();
    expect(ServiceWorker.__get__('sendInsightToContentScript')).toHaveBeenCalledWith(2, expect.objectContaining({ pattern_type: 'Offline' }));
  });

  it('should handleChallengeAccepted and update challenge log', async () => {
    const addWXP = jest.fn();
    const update = jest.fn();
    ServiceWorker.__set__('GamificationService', { addWXP });
    ServiceWorker.__set__('MindframeStore', { update });

    await ServiceWorker.__get__('handleChallengeAccepted')({ challengePrompt: 'prompt', hcRelated: 'skill' });
    expect(addWXP).toHaveBeenCalled();
    expect(update).toHaveBeenCalled();
  });
});