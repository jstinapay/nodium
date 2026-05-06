// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const executeAi = inngest.createFunction(
  { id: "execute-ai", triggers: { event: "execute/ai" } },
  async ({ event, step }) => {
    
    await step.sleep("pretend", "5s")

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text", 
      generateText, 
      {
        model: google('gemini-2.5-flash'),
        system: "You are a helpful assistant.",
        prompt: "What is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          functionId: "gemini-2.5-flash",
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

        const { steps: openAiSteps } = await step.ai.wrap(
      "openai-generate-text", 
      generateText, 
      {
        model: openai('gpt-3.5-turbo'),
        system: "You are a helpful assistant.",
        prompt: "What is 2+2?",
      }
    );

        const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text", 
      generateText, 
      {
        model: anthropic('claude-3-5-sonnet'),
        system: "You are a helpful assistant.",
        prompt: "What is 2+2?",
      }
    );
    return {
      geminiSteps,
      openAiSteps,
      anthropicSteps
    };
  }
);