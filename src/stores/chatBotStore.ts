import { create } from "zustand";

export type historicalUserInput = {
  text: string;
  timestamp: number;
};

type State = {
  userInput: string;
  historicalUserInput: historicalUserInput[];
  timestamps: number[];
  aiContent: { text: string; timestamp: number }[];
};

type Action = {
  setUserInput: (userInput: State["userInput"]) => void;
  setHistoricalUserInput: (
    historicalUserInput: State["historicalUserInput"],
  ) => void;
  setTimestamps: (timestamps: State["timestamps"]) => void;
  setAiContent: (aiContent: State["aiContent"]) => void;
};

const chatBotStore = create<State & Action>((set) => ({
  userInput: "",
  setUserInput: (userInput) => set({ userInput }),
  historicalUserInput: [{ text: "", timestamp: Date.now() }],
  setHistoricalUserInput: (historicalUserInput) =>
    set((state) => ({
      historicalUserInput: [
        ...state.historicalUserInput,
        ...historicalUserInput,
      ],
    })),
  timestamps: [],
  setTimestamps: (timestamps) =>
    set((state) => ({ timestamps: [...state.timestamps, ...timestamps] })),
  aiContent: [{ text: "How can I help you?", timestamp: Date.now() }],
  setAiContent: (aiContent) =>
    set((state) => ({ aiContent: [...state.aiContent, ...aiContent] })),
}));

export default chatBotStore;
