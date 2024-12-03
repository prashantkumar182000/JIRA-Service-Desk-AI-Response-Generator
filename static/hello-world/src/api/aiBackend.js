import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';
const HF_API_KEY = process.env.REACT_APP_HF_API_KEY;

if (!HF_API_KEY) {
  throw new Error('HF_API_KEY environment variable is not set.');
}

export const fetchAIResponse = async ({ subject, description, context }) => {
  if (!subject || !description || !Array.isArray(context)) {
    console.error('Invalid inputs provided:', { subject, description, context });
    return { suggestedResponse: 'Invalid inputs. Please check and try again.' };
  }

  const payload = {
    inputs: `${subject}\n\n${description}\n\n${context.join('\n')}`,
  };

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();
    if (data?.[0]?.generated_text) {
      return { suggestedResponse: data[0].generated_text };
    } else {
      throw new Error('Unexpected response format from Hugging Face API.');
    }
  } catch (error) {
    console.error('Error fetching AI response:', error.message);
    return { suggestedResponse: 'Failed to generate response. Please try again later.' };
  }
};

export default fetchAIResponse;
