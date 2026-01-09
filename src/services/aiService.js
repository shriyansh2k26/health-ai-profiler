import Groq from "groq-sdk";
import fs from "fs/promises";
import { ExtractionSchema } from "../schemas/healthSchema.js";
import { calculateRiskScore } from "./scoringService.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const processHealthSurvey = async (textInput, imageFile) => {
  let userContent = [];

  // 1. Setup Multimodal Inputs
  if (textInput) {
    userContent.push({ type: "text", text: `User Text: ${textInput}` });
  }

  if (imageFile) {
    const base64Image = await fs.readFile(imageFile.path, { encoding: "base64" });
    userContent.push({
      type: "image_url",
      image_url: { url: `data:${imageFile.mimetype};base64,${base64Image}` }
    });
  }

  //  STEP 1: AI Extraction with Confidence Scoring 
const extractionResponse = await groq.chat.completions.create({
  messages: [
    {
      role: "system",
      content: `Extract health data into a JSON object with this exact structure:
      {
        "answers": {
          "age": number or null,
          "smoker": boolean or null,
          "exercise": "rarely" | "sometimes" | "often" | null,
          "diet": string or null
        },
        "confidence": number,
        "missing_fields": string[]
      }`
    },
    { role: "user", content: userContent }
  ],
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  response_format: { type: "json_object" },
});

  const rawData = JSON.parse(extractionResponse.choices[0].message.content);
  
  // VALIDATION: Parse and Validate via Zod
  const extraction = ExtractionSchema.parse(rawData);

  //  Implementation of Guardrails
  const answers = extraction.answers;
  const presentFields = [
    answers.age, 
    answers.smoker, 
    answers.exercise, 
    answers.diet
  ].filter(val => val !== null && val !== undefined).length;

  // EXIT CONDITION: >50% missing 
  if (presentFields < 2) {
    return {
      status: "incomplete_profile",
      reason: ">50% fields missing",
      confidence: extraction.confidence,
      missing: extraction.missing_fields
    };
  }

  // Deterministic Scoring 
  const scoreResult = calculateRiskScore(extraction.answers);

  // Chained Recommendations 
  const recommendationResponse = await groq.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "Provide 3 lifestyle tips in JSON format with a 'recommendations' array of strings." 
      },
      { 
        role: "user", 
        content: `Suggest tips for: ${scoreResult.rationale.join(", ")}` 
      }
    ],
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    response_format: { type: "json_object" },
  });

  const recommendationsData = JSON.parse(recommendationResponse.choices[0].message.content);

  // Final Response Structure
  return {
    status: "ok",
    risk_level: scoreResult.risk_level,
    confidence: extraction.confidence,
      missing_fields: extraction.missing_fields,
    score: scoreResult.score,
    factors: scoreResult.rationale,
    recommendations: recommendationsData.recommendations || [],
    
      
    
  };
};