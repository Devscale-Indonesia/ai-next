"use server";

import { parseJSON } from "@/libs/parsingObject";
import OpenAI from "openai";
import Replicate from "replicate";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function generateStory(_prevState, formData) {
  const prompt = formData.get("prompt");

  const response = await openAi.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are expert on story telling, always have very meaningful message on every single story you've made.\nUse clear and easy language for crafting the story, so even kids are able to understand.\n\nIMPORTANT\nALWAYS RESPONSE WITH VALID JSON OBJECT WITH FOLLOWING KEYS AND TYPE :\n\n- title : string\n- characters: string[]\n- stories: string[]\n- moralLessons: string[]\n- imagePrompt: string\n\nEXAMPLE OF IMAGE PROMPT\nIllustrations of the a deer and a rabbit in the jungle, in kids pastel colorful comic style.\n\nIMPORTANT\nThe story shouldn't be too long, and too short, do about 4-5 paragraphs.\n\nIMPORTANT\nGive the characters a name.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "json_object",
    },
  });

  console.log(response.choices[0].message.content);

  const story = JSON.parse(response.choices[0].message.content);

  const imagePrompt = story?.imagePrompt;

  const input = {
    prompt: imagePrompt,
    go_fast: true,
    num_outputs: 1,
    aspect_ratio: "3:4",
    output_format: "png",
    output_quality: 80,
  };

  const output = await replicate.run("black-forest-labs/flux-schnell", { input });

  return { story, coverImage: output[0] };
}
