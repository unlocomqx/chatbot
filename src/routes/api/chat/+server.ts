import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';
import { OPENAI_API_KEY } from '$env/static/private'

// You may want to replace the above with a static private env variable
// for dead-code elimination and build-time type-checking:

// Create an OpenAI Provider instance
const openai = createOpenAI({
  baseURL: 'http://chat.prestalife.net:8080/v1',
  apiKey: OPENAI_API_KEY ?? '',
});

export const POST = (async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { messages } = await request.json();

  // Call the language model
  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      // implement your own logic here, e.g. for storing messages
      // or recording token usage
    },
  });

  // Respond with the stream
  return result.toDataStreamResponse();
}) satisfies RequestHandler;
