
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
};

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = getAiClient();
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Sei 'OP-BOT', l'assistente AI per un negozio streetwear e meme chiamato "Brainrot OP".
      
      Tono: Estremamente Gen Z Italiano, usa slang come "Bella", "Bro", "No Cap", "Based", "Sigma", "Skibidi", "Aò", "Godo".
      
      Contesto: 
      - L'utente è sul sito "STEAL A BRAINROT OP!".
      - Vendiamo oggetti finti ma potentissimi (overpowered).
      
      Obiettivo: Hype sui prodotti, sii divertente, usa emoji come 💀, 🗿, 🔥, 🧢.
      Risposte brevi e caotiche in ITALIANO.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Bruh, niente API Key? Non è molto sigma. 💀";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Glitch nel matrix.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "System crash (L + Ratio). Riprova.";
  }
};

export const generateBrainrotQuiz = async (): Promise<QuizQuestion | null> => {
  if (!API_KEY) return null;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Genera una domanda divertente a risposta multipla (trivia quiz) sulla cultura di internet 'Brainrot' moderna (Skibidi Toilet, Rizz, Ohio, Sigma, Meme Italiani recenti ecc.) rigorosamente in ITALIANO. Assicurati che la domanda sia diversa ogni volta.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" }
          },
          required: ["question", "options", "correctIndex"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion;
    }
    return null;
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return null;
  }
};
