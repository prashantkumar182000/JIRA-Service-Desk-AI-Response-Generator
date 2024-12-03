import React, { useEffect, useState } from 'react';

function ResponsePanel({ ticketId }) {
  const [response, setResponse] = useState('Generating response...');
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const generateAIResponse = async () => {
      try {
        console.log(`Sending request to /functions/resolver with ticketId: ${ticketId}`);

        const result = await fetch('/functions/resolver', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ ticketId }),
        });

        if (!result.ok) {
          const errorText = await result.text();
          throw new Error(`API responded with status ${result.status}: ${errorText}`);
        }

        const data = await result.json();
        if (data?.response) {
          setResponse(data.response);
        } else {
          throw new Error('Invalid API response format.');
        }
      } catch (error) {
        console.error('Error generating AI response:', error.message);
        setResponse('Failed to generate response.');
        setErrorDetails(error.message);
      }
    };

    if (ticketId) {
      generateAIResponse();
    }
  }, [ticketId]);

  return (
    <div>
      <h4>Response</h4>
      <p>{response}</p>
      {errorDetails && <pre style={{ color: 'red' }}>Error Details: {errorDetails}</pre>}
    </div>
  );
}

export default function App() {
  const [ticketId, setTicketId] = useState('');
  const [manualTicketId, setManualTicketId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketId = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const ticket = urlParams.get('ticketId');

        if (ticket) {
          console.log('Ticket ID from URL:', ticket);
          setTicketId(ticket);
        } else {
          console.error('Ticket ID not found in URL.');
          const currentUrl = window.location.href;
          const match = currentUrl.match(/\/([A-Z]+-\d+)(\?|$)/);
          if (match && match[1]) {
            console.log('Extracted Ticket ID from URL:', match[1]);
            setTicketId(match[1]);
          }
        }
      } catch (error) {
        console.error('Error fetching ticket ID:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketId();
  }, []);

  const handleManualTicketIdSubmit = () => {
    if (!manualTicketId) {
      console.error('Manual Ticket ID is empty.');
      return;
    }
    console.log('Manually entered Ticket ID:', manualTicketId);
    setTicketId(manualTicketId);
  };

  if (loading) {
    return <p>Loading ticket...</p>;
  }

  return (
    <div>
      <h4>JIRA AI Response Generator</h4>
      {ticketId ? (
        <ResponsePanel ticketId={ticketId} />
      ) : (
        <div>
          <p>Ticket ID not found in the URL. Please enter it manually:</p>
          <input
            type="text"
            placeholder="Enter Ticket ID"
            value={manualTicketId}
            onChange={(e) => setManualTicketId(e.target.value)}
          />
          <button onClick={handleManualTicketIdSubmit}>Submit Ticket ID</button>
        </div>
      )}
    </div>
  );
}
