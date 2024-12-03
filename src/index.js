import dotenv from 'dotenv';
import express from 'express';
const getJiraTicketDetails = require('../static/hello-world/src/api/jiraService.mjs');


dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json()); // Parse JSON bodies

const jiraEmail = process.env.REACT_APP_JIRA_EMAIL;
const jiraApiKey = process.env.REACT_APP_ATLASSIAN_API_KEY;

// Add a route to handle the root ("/") URL for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Jira Service Desk AI Response Generator!');
});

app.post('/functions/resolver', async (req, res) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    console.error('Ticket ID is missing in the request body.');
    return res.status(400).json({ error: 'Ticket ID is required.' });
  }

  try {
    const ticketDetails = await getJiraTicketDetails(ticketId, jiraApiKey, jiraEmail);

    // Simulate AI response generation
    const aiResponse = {
      suggestedResponse: `This is an AI-generated response for ticket ID: ${ticketId}`,
    };

    res.json({ response: aiResponse.suggestedResponse, ticketDetails });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Define the handler function expected by the manifest.yml
export const handler = async (event) => {
  try {
    // Assuming event has ticketId property
    const ticketId = event.ticketId;
    const ticketDetails = await getJiraTicketDetails(ticketId, jiraApiKey, jiraEmail);
    return {
      statusCode: 200,
      body: JSON.stringify({ ticketDetails }),
    };
  } catch (error) {
    console.error('Error processing event:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
