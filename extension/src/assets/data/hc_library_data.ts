
interface HCLibraryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export const hcLibrary: HCLibraryItem[] = [
  {
    id: "critical_thinking",
    name: "Critical Thinking",
    description: "The ability to analyze information objectively and make reasoned judgments",
    icon: "🧠",
    category: "cognitive"
  },
  {
    id: "systems_thinking",
    name: "Systems Thinking",
    description: "Understanding how different parts of a system interact and influence each other",
    icon: "🔄",
    category: "cognitive"
  },
  {
    id: "metacognition",
    name: "Metacognition",
    description: "Awareness and understanding of one's own thought processes",
    icon: "🎯",
    category: "cognitive"
  },
  {
    id: "decision_making",
    name: "Decision Making",
    description: "The ability to make choices by identifying value, gathering information, and assessing alternatives",
    icon: "⚖️",
    category: "cognitive"
  },
  {
    id: "problem_solving",
    name: "Problem Solving",
    description: "Finding solutions to difficult or complex issues",
    icon: "🔍",
    category: "cognitive"
  }
];

export default hcLibrary;
