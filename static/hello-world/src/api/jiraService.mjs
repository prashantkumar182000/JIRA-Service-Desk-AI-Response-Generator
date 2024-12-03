import axios from 'axios';

const getJiraTicketDetails = async (ticketId, apiKey, email) => {
  try {
    const credentials = `${email}:${apiKey}`;
    const base64Auth = Buffer.from(credentials).toString('base64');

    const response = await axios.get(
      `https://prashantkumar18pk.atlassian.net/rest/api/3/issue/${ticketId}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${base64Auth}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching Jira ticket:', error.message);
    throw new Error(error.message);
  }
};

module.exports = getJiraTicketDetails;
