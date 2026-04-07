import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./supabase";
import { fetchPrompts } from "./prompt-manager";

/**
 * Fetches the Gemini API key from the Supabase settings table.
 */
export async function getGeminiApiKey(): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'api_keys')
    .maybeSingle();

  if (error) {
    console.error('Error fetching Gemini API key:', error);
    return null;
  }

  return (data?.value as any)?.gemini || null;
}

/**
 * Unified text generation helper that switches between Gemini and OpenRouter.
 */
export async function generateAIText(prompt: string, modelId: string = "gemini"): Promise<string> {
  if (modelId === "gemini" || modelId.includes("gemini")) {
    const model = await getGeminiModel("gemini-1.5-flash-latest");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) throw new Error("Gemini produced an empty response.");
    return text;
  } else {
    // OpenRouter flow
    return await generateOpenRouterText(prompt, modelId);
  }
}

/**
 * Initializes and returns a Gemini model instance.
 */
export async function getGeminiModel(modelName: string = "gemini-1.5-flash") {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key not found. Check settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Generates SEO content using the specified model.
 */
export async function generateSEOContent(topic: string, details: string = "", contentType: string = "Long video", modelId: string = "gemini") {
  const section = (contentType === "Long video") ? "long" : "short";
  const prompts = await fetchPrompts("seo", section);
  
  const prompt = `
    You are a YouTube SEO expert. 
    
    ADMIN INSTRUCTIONS:
    - TITLE: ${prompts.title?.text || prompts.title}
    - DESCRIPTION: ${prompts.description?.text || prompts.description}
    - TAGS: ${prompts.tags?.text || prompts.tags}
    - HASHTAGS: ${prompts.hashtags?.text || prompts.hashtags}

    Generate a viral SEO package for a video with the following topic:
    Topic: ${topic}
    Details: ${details}
 
    Return the result EXACTLY in this JSON format:
    {
      "title": "Optimized viral title",
      "description": "Engaging description with chapters and keywords",
      "tags": "comma, separated, tags",
      "hashtags": "#hashtag1 #hashtag2 #hashtag3"
    }
  `;

  let finalModelId = modelId;
  if (modelId === "gemini" && prompts.title?.model && prompts.title.model !== 'gemini') {
    finalModelId = prompts.title.model;
  }

  const text = await generateAIText(prompt, finalModelId);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  throw new Error("Failed to parse SEO JSON.");
}

/**
 * Generates trending content ideas based on type, topic, and niche.
 */
export async function generateContentIdeas(type: string, lastTopic: string, niche: string, modelId: string = "gemini") {
  const subType = (type === "Long video") ? "long" : "short";
  const prompts = await fetchPrompts("content", "idea");
  const adminPromptData = prompts[subType];
  const adminPrompt = adminPromptData?.text || adminPromptData || "Suggest trending content ideas.";
  
  const prompt = `
    You are a YouTube content strategist.
    ADMIN INSTRUCTION: ${adminPrompt}
    
    Based on the following information, suggest 5 trending and viral content ideas for a ${type}.
    - Type: ${type}
    - Topic of last video: ${lastTopic}
    - Channel Niche: ${niche}

    Return JSON exactly as:
    {
      "ideas": [
        {
          "title": "Idea Title",
          "hook": "Hook",
          "description": "Desc",
          "viralScore": 95
        }
      ]
    }
  `;

  let finalModelId = modelId;
  if (modelId === "gemini" && adminPromptData?.model && adminPromptData.model !== 'gemini') {
    finalModelId = adminPromptData.model;
  }

  const text = await generateAIText(prompt, finalModelId);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  throw new Error("Failed to parse Ideas JSON.");
}

/**
 * Generates a full script based on an idea and context.
 */
export async function generateScript(idea: any, type: string, niche: string, language: string = "English", modelId: string = "gemini") {
  const subType = (type === "Long video" || type === "Script") ? "long" : "short";
  const prompts = await fetchPrompts("content", "script");
  const adminPromptData = prompts[subType];
  const adminPrompt = adminPromptData?.text || adminPromptData || "Write an engaging script.";
  
  const prompt = `
    You are an expert scriptwriter for YouTube.
    ADMIN INSTRUCTION: ${adminPrompt}

    Write a high-retention, viral script for the following idea:
    - Idea Title: ${idea.title}
    - Type: ${type}
    - Niche: ${niche}
    - Requested Language: ${language}

    Return result EXACTLY in this JSON format:
    {
      "script": "The full script text here...",
      "refinements": ["Refinement 1", "Refinement 2", "Refinement 3"]
    }
  `;

  let finalModelId = modelId;
  if (modelId === "gemini" && adminPromptData?.model && adminPromptData.model !== 'gemini') {
    finalModelId = adminPromptData.model;
  }

  const text = await generateAIText(prompt, finalModelId);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  throw new Error("Failed to parse Script JSON.");
}

/**
 * Refines an existing script based on a specific instruction or custom prompt.
 */
export async function refineScript(script: string, instruction: string, language: string = "English", modelId: string = "gemini") {
  const prompt = `
    You are an expert script editor. Refine the script based on this: ${instruction}. Original script: ${script}. Lang: ${language}.
    Return JSON exactly as:
    {
      "script": "refined script",
      "refinements": ["new 1", "new 2"]
    }
  `;
  const text = await generateAIText(prompt, modelId);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  throw new Error("Failed to parse refined Script JSON.");
}

/**
 * Generates text using OpenRouter.
 */
export async function generateOpenRouterText(prompt: string, model: string = "mistralai/mistral-small-24b-instruct:free") {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OpenRouter Key missing.");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "X-Title": "Creator AI",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": model,
      "messages": [{ "role": "user", "content": prompt }]
    })
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenRouter Empty Response.");
  return text;
}
