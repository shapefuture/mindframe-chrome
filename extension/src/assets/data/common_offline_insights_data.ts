
import type { OfflineInsight } from '../../core_logic/types';

export const commonOfflineInsights: OfflineInsight[] = [
  {
    pattern_type: "information_overload",
    hc_related: "critical_thinking",
    explanation: "When faced with large amounts of information, it's important to organize and prioritize effectively.",
    micro_challenge_prompt: "Take 2 minutes to identify the three most important points from what you just read.",
    original_text_segment: ""
  },
  {
    pattern_type: "assumption_detection",
    hc_related: "metacognition",
    explanation: "We often make unconscious assumptions that can affect our understanding and decision-making.",
    micro_challenge_prompt: "List two assumptions you might be making about this topic and how they could be tested.",
    original_text_segment: ""
  },
  {
    pattern_type: "perspective_taking",
    hc_related: "systems_thinking",
    explanation: "Understanding different perspectives helps build a more complete picture of complex situations.",
    micro_challenge_prompt: "Consider this topic from the perspective of someone with a completely different background. What might they notice that you didn't?",
    original_text_segment: ""
  },
  {
    pattern_type: "decision_point",
    hc_related: "decision_making",
    explanation: "Complex decisions benefit from structured thinking and clear criteria.",
    micro_challenge_prompt: "Write down your decision criteria and weight them by importance before proceeding.",
    original_text_segment: ""
  },
  {
    pattern_type: "problem_framing",
    hc_related: "problem_solving",
    explanation: "How we frame a problem affects what solutions we can see.",
    micro_challenge_prompt: "Try restating the problem in three different ways. Which framing opens up new solution possibilities?",
    original_text_segment: ""
  }
];

export default commonOfflineInsights;
