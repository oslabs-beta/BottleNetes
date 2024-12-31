import { create } from "zustand";

export type historicalUserInput = {
  text: string;
  timestamp: Date;
};

type State = {
  userInput: string;
  historicalUserInput: historicalUserInput[];
  timestamps: Date[];
  aiContent: { text: string; timestamp: Date }[];
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
  historicalUserInput: [{ text: "", timestamp: new Date(Date.now()) }],
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
  aiContent: [{ text: "How can I help you?", timestamp: new Date(Date.now()) }],
  setAiContent: (aiContent) =>
    set((state) => ({ aiContent: [...state.aiContent, ...aiContent] })),
}));

export default chatBotStore;
