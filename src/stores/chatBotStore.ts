import { create } from "zustand";

export type Message = {
  text: string;
  timestamp: number;
};

type State = {
  userInput: string;
  historicalUserInput: Message[];
  timestamps: number[];
  aiContent: Message[];
};

type Action = {
  setUserInput: (userInput: State["userInput"]) => void;
  setHistoricalUserInput: (historicalUserInput: Message) => void;
  setTimestamps: (timestamp: number) => void;
  setAiContent: (aiContent: Message) => void;
  resetChat: () => void;
};

const chatBotStore = create<State & Action>((set) => ({
  userInput: "",
  setUserInput: (userInput) => set({ userInput }),

  historicalUserInput: [],
  setHistoricalUserInput: (message) =>
    set((state) => ({
      historicalUserInput: [...state.historicalUserInput, message],
    })),

  timestamps: [],
  setTimestamps: (timestamp) =>
    set((state) => ({
      timestamps: [...state.timestamps, timestamp],
    })),

  aiContent: [{ text: "How can I help you?", timestamp: Date.now() }],
  setAiContent: (message) =>
    set((state) => ({
      aiContent: [...state.aiContent, message],
    })),

  resetChat: () =>
    set({
      historicalUserInput: [],
      timestamps: [],
      aiContent: [{ text: "How can I help you?", timestamp: Date.now() }],
    }),
}));

export default chatBotStore;
