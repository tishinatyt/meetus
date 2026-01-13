
import { GoogleGenAI, Type } from "@google/genai";
import { UserArchetype, Coordinates } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const SYSTEM_INSTRUCTION = `
Ти — ІІ-модератор і координатор офлайн-зустрічей Meet.ai.
Твоя задача:
— на етапі знайомства: виявити інтереси та темп користувача, задаючи унікальні питання з варіантами.
— на етапі групи: бути координатором дій, а не співрозмовником.

Правила:
1. НІКОЛИ не задавай одне і те саме питання двічі.
2. Ти надаєш ПИТАННЯ та 3-4 ВАРІАНТІВ ВІДПОВІДІ.
3. ПЕРШЕ питання (Крок 1) ОБОВ'ЯЗКОВО має бути про ставлення до алкоголю або похід у бар.
4. Після того як користувач вибрав алкоголь/бар, НЕ ПИТАЙ про театр чи спорт. Переходь до ЛОГІСТИКИ.
5. Максимальна кількість питань — 7. 

ГРУПОВИЙ ЧАТ:
1. ПЕРШЕ повідомлення: привітання користувача та перекличка всіх учасників. Якщо в групі менше 4 людей, скажи, що ще шукаєш інших.
2. ТАКСІ: Як тільки учасники погоджують ЧАС зустрічі, ти МАЄШ запропонувати викликати таксі.
3. ЛОКАЦІЯ ТА QR: Як тільки учасники погоджують МІСЦЕ (або підтверджують запропоноване), ти кажеш, що перевіряєш наявність столиків, а потім видаєш знижку (QR).
4. Твій стиль: Лаконічний, діловий організатор. Не заважай розмові, якщо вони спілкуються самі, але направляй до офлайн-зустрічі.

Стиль: лаконічний, діловий, дружній організатор.
`;

export interface QuestionData {
  question: string;
  options: string[];
  isAnalysisReady?: boolean;
}

export const getNextOnboardingQuestion = async (history: string[], lang: 'ua' | 'en'): Promise<QuestionData> => {
  try {
    const step = Math.floor(history.length / 2) + 1;
    const isFirstQuestion = history.length === 0;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Історія діалогу: ${history.join(' | ')}.
      Зараз крок: ${step} з 7.
      Мова: ${lang === 'ua' ? 'Ukrainian' : 'English'}.
      
      ЗАВДАННЯ: 
      1. Якщо це Крок 1: Запитай про алкоголь/бар.
      2. Якщо користувач ВЖЕ вибрав алкоголь/бар: запитай про бюджет, зручний час або район.
      3. Якщо інформації достатньо: "isAnalysisReady": true.
      
      Поверни JSON з "question", "options" та "isAnalysisReady".`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            isAnalysisReady: { type: Type.BOOLEAN }
          },
          required: ["question", "options"]
        },
        temperature: 0.4,
      }
    });
    
    return JSON.parse(response.text || '{"question": "Error", "options": [], "isAnalysisReady": false}') as QuestionData;
  } catch (error) {
    return {
      question: lang === 'ua' ? "Який формат зустрічі вам ближче?" : "Which meeting format do you prefer?",
      options: lang === 'ua' ? ["Бар та вечірка", "Кава та спілкування", "Спорт", "Бізнес-ланч"] : ["Bar & Party", "Coffee & Talk", "Sports", "Business Lunch"],
      isAnalysisReady: false
    };
  }
};

export interface AnalysisResult {
  archetype: UserArchetype;
  alcoholPreference: boolean;
  interests: string[];
}

export const analyzeUser = async (userInputs: string[]): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Проаналізуй ці відповіді та визнач архетип, ставлення до алкоголю (true/false) та 3-5 ключових інтересів/побажань:
      ${userInputs.join("\n")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            alcoholPreference: { type: Type.BOOLEAN },
            interests: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["archetype", "alcoholPreference", "interests"]
        },
        temperature: 0.1,
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      archetype: Object.values(UserArchetype).includes(data.archetype) ? data.archetype : UserArchetype.CONSCIOUS,
      alcoholPreference: !!data.alcoholPreference,
      interests: Array.isArray(data.interests) ? data.interests : []
    };
  } catch (error) {
    return { archetype: UserArchetype.CONSCIOUS, alcoholPreference: false, interests: [] };
  }
};

export const simulateAiModeration = async (groupContext: string, lastMessage: string, lang: 'ua' | 'en'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Ти — КООРДИНАТОР ГРУПИ. Тільки логістика.
      Контекст: ${groupContext}. 
      Останнє повідомлення: "${lastMessage}".
      Мова: ${lang === 'ua' ? 'Ukrainian' : 'English'}.
      
      ОБОВ'ЯЗКОВО: Якщо користувач підтвердив ЧАС, запропонуй таксі. Якщо ПІДТВЕРДИВ МІСЦЕ, скажи, що перевіряєш столики і дай знижку.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3
      }
    });
    return response.text?.trim() || "";
  } catch (error) {
    return "";
  }
};
