import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

export const initializeAI = () => {
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const createChatSession = (): Chat | null => {
  const client = initializeAI();
  if (!client) return null;

  return client.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a helpful, witty, and concise AI assistant. You answer quickly and accurately.",
    },
  });
};

export type StreamCallback = (text: string) => void;

export const sendMessageStream = async (
  chat: Chat,
  message: string,
  onChunk: StreamCallback
): Promise<string> => {
  try {
    const resultStream = await chat.sendMessageStream({ message });
    let fullText = "";
    
    for await (const chunk of resultStream) {
      const content = chunk as GenerateContentResponse;
      if (content.text) {
        fullText += content.text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
