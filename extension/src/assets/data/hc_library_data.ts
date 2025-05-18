import type { HCData } from "../../core_logic/types";

/**
 * Library of higher-order cognitive skills for Mindframe OS.
 * Each entry is used for user interests, skill mapping, and icon display.
 */
export const hcLibrary: HCData[] = [
  {
    id: "critical_thinking",
    name: "Critical Thinking",
    description: "Analyze and evaluate information to form sound judgments.",
    icon: "🧠"
  },
  {
    id: "systems_thinking",
    name: "Systems Thinking",
    description: "Understand how parts interrelate within a whole.",
    icon: "🌐"
  },
  {
    id: "decision_making",
    name: "Decision Making",
    description: "Make thoughtful, informed choices.",
    icon: "🤔"
  },
  {
    id: "problem_solving",
    name: "Problem Solving",
    description: "Identify and resolve complex challenges.",
    icon: "🛠️"
  },
  {
    id: "bias_detection",
    name: "Bias Detection",
    description: "Recognize and mitigate cognitive biases.",
    icon: "🔎"
  }
];
