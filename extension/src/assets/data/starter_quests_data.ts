
interface Quest {
  id: string;
  title: string;
  description: string;
  wxpReward: number;
  requirements: {
    level?: number;
    completedQuests?: string[];
    hcProficiency?: Record<string, number>;
  };
  steps: {
    id: string;
    description: string;
    completionCriteria: string;
  }[];
}

export const starterQuests: Quest[] = [
  {
    id: "quest_metacognition_101",
    title: "Metacognition 101",
    description: "Begin your journey of thinking about thinking",
    wxpReward: 50,
    requirements: {
      level: 1
    },
    steps: [
      {
        id: "step_1",
        description: "Complete the initial cognitive bias assessment",
        completionCriteria: "Submit SJT assessment"
      },
      {
        id: "step_2",
        description: "Review your cognitive bias profile",
        completionCriteria: "View profile page"
      }
    ]
  },
  {
    id: "quest_critical_thinker",
    title: "Apprentice Critical Thinker",
    description: "Master the basics of critical thinking",
    wxpReward: 100,
    requirements: {
      level: 2,
      completedQuests: ["quest_metacognition_101"],
      hcProficiency: {
        "critical_thinking": 1
      }
    },
    steps: [
      {
        id: "step_1",
        description: "Complete 3 critical thinking challenges",
        completionCriteria: "Complete 3 challenges tagged with critical_thinking"
      },
      {
        id: "step_2",
        description: "Pass the Critical Thinking Basics drill",
        completionCriteria: "Complete drill_critical_thinking_basics"
      }
    ]
  }
];

export default starterQuests;
