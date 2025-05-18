
import type { SJTScenario } from '../../core_logic/types';

export const sjtScenarios: SJTScenario[] = [
  {
    id: "sjt_1",
    scenarioText: "You're leading a project and receive feedback that contradicts your initial approach. The feedback seems valid but implementing it would require significant changes to work already completed.",
    options: [
      {
        text: "Stick to the original plan since changing course would be too disruptive",
        cognitiveBiasTargeted: "Status Quo Bias",
        cognitiveBiasTargetedScore: 2,
        isBetterThinking: false
      },
      {
        text: "Carefully evaluate the feedback and assess the long-term benefits versus short-term costs",
        cognitiveBiasTargeted: null,
        isBetterThinking: true
      },
      {
        text: "Immediately implement all suggested changes to avoid any potential issues",
        cognitiveBiasTargeted: "Action Bias",
        cognitiveBiasTargetedScore: 1,
        isBetterThinking: false
      }
    ],
    biasExplanation: "This scenario tests for status quo bias and action bias, both of which can impair optimal decision-making",
    relatedInterests: ["project_management", "decision_making"]
  },
  {
    id: "sjt_2",
    scenarioText: "You read an article that perfectly confirms your existing views on a controversial topic. What's your next step?",
    options: [
      {
        text: "Share it immediately with others who share your viewpoint",
        cognitiveBiasTargeted: "Confirmation Bias",
        cognitiveBiasTargetedScore: 2,
        isBetterThinking: false
      },
      {
        text: "Look for credible sources with opposing viewpoints to understand the full picture",
        cognitiveBiasTargeted: null,
        isBetterThinking: true
      },
      {
        text: "Fact-check the article's main claims and examine its methodology",
        cognitiveBiasTargeted: null,
        isBetterThinking: true
      }
    ],
    biasExplanation: "This scenario examines confirmation bias and the tendency to seek information that confirms our existing beliefs",
    relatedInterests: ["critical_thinking", "research"]
  }
];

export default sjtScenarios;
