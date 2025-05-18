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

  // You can add more tests for handleAnalyzeRequest/handleChallengeAccepted with further mocks
});