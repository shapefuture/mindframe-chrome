import type { SJTScenario } from "../../core_logic/types";

/**
 * Example SJT (Situational Judgment Test) scenarios with options for onboarding.
 * Each option is fully typed and includes cognitiveBiasTargeted and cognitiveBiasTargetedScore.
 */
export const sjtScenarios: SJTScenario[] = [
  {
    id: "confirmation_bias_email",
    scenarioText:
      "You receive an email that confirms your long-held belief about a controversial topic. Do you...",
    options: [
      {
        text: "Accept the information without further investigation.",
        cognitiveBiasTargeted: "Confirmation Bias",
        cognitiveBiasTargetedScore: 2,
        isBetterThinking: false,
      },
      {
        text: "Seek additional sources to verify the claim.",
        cognitiveBiasTargeted: null,
        cognitiveBiasTargetedScore: 0,
        isBetterThinking: true,
      },
      {
        text: "Share the information with others who agree with you.",
        cognitiveBiasTargeted: "Confirmation Bias",
        cognitiveBiasTargetedScore: 1,
        isBetterThinking: false,
      },
    ],
    biasExplanation:
      "Confirmation bias is the tendency to search for, interpret, favor, and recall information that confirms one's preexisting beliefs.",
    relatedInterests: ["critical_thinking", "bias_detection"],
  },
  {
    id: "anchoring_bias_shopping",
    scenarioText:
      "A product is first shown to you at $200 but later offered for $120. What is your reaction?",
    options: [
      {
        text: "Feel like $120 is a great deal and purchase immediately.",
        cognitiveBiasTargeted: "Anchoring Bias",
        cognitiveBiasTargetedScore: 2,
        isBetterThinking: false,
      },
      {
        text: "Research the typical price for this product online.",
        cognitiveBiasTargeted: null,
        cognitiveBiasTargetedScore: 0,
        isBetterThinking: true,
      },
      {
        text: "Wait for a better offer without checking the market value.",
        cognitiveBiasTargeted: "Anchoring Bias",
        cognitiveBiasTargetedScore: 1,
        isBetterThinking: false,
      },
    ],
    biasExplanation:
      "Anchoring bias occurs when people rely too heavily on the first piece of information they receive.",
    relatedInterests: ["decision_making", "critical_thinking"],
  },
  {
    id: "availability_bias_news",
    scenarioText:
      "After seeing news reports about airplane accidents, you...",
    options: [
      {
        text: "Decide to drive instead of fly, believing flying is unsafe.",
        cognitiveBiasTargeted: "Availability Bias",
        cognitiveBiasTargetedScore: 2,
        isBetterThinking: false,
      },
      {
        text: "Look up actual statistics on air travel safety.",
        cognitiveBiasTargeted: null,
        cognitiveBiasTargetedScore: 0,
        isBetterThinking: true,
      },
      {
        text: "Avoid discussing your travel plans.",
        cognitiveBiasTargeted: null,
        cognitiveBiasTargetedScore: 0,
        isBetterThinking: false,
      },
    ],
    biasExplanation:
      "Availability bias is a mental shortcut that relies on immediate examples that come to mind.",
    relatedInterests: ["systems_thinking", "bias_detection"],
  }
];
