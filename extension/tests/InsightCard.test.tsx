/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InsightCard from '../src/ui_components/InsightCard';
import type { LLMInsight } from '../src/core_logic/types';

describe('InsightCard', () => {
  const mockInsight: LLMInsight = {
    pattern_type: "Confirmation Bias",
    hc_related: "bias_detection",
    explanation: "You may be favoring information that confirms your beliefs.",
    micro_challenge_prompt: "Try to seek out an opposing viewpoint.",
    highlight_suggestion_css_selector: null,
    original_text_segment: "Example segment"
  };

  it('renders all main fields', () => {
    render(<InsightCard insight={mockInsight} onAccept={() => {}} onDismiss={() => {}} />);
    expect(screen.getByText(/Confirmation Bias/)).toBeInTheDocument();
    expect(screen.getByText(/You may be favoring/)).toBeInTheDocument();
    expect(screen.getByText(/Try to seek out/)).toBeInTheDocument();
    expect(screen.getByText(/Accept Challenge/)).toBeInTheDocument();
    expect(screen.getByText(/Dismiss/)).toBeInTheDocument();
  });

  it('calls onAccept when Accept Challenge is clicked', () => {
    const onAccept = jest.fn();
    render(<InsightCard insight={mockInsight} onAccept={onAccept} onDismiss={() => {}} />);
    fireEvent.click(screen.getByText(/Accept Challenge/));
    expect(onAccept).toHaveBeenCalledWith(mockInsight.micro_challenge_prompt, mockInsight.hc_related);
  });

  it('calls onDismiss when Dismiss is clicked', () => {
    const onDismiss = jest.fn();
    render(<InsightCard insight={mockInsight} onAccept={() => {}} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByText(/Dismiss/));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('logs errors if onAccept or onDismiss throw', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const onAccept = () => { throw new Error('accept error'); };
    const onDismiss = () => { throw new Error('dismiss error'); };

    render(<InsightCard insight={mockInsight} onAccept={onAccept} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByText(/Accept Challenge/));
    fireEvent.click(screen.getByText(/Dismiss/));
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});