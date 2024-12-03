import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import FeedbackForm from './FeedbackForm';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';

const ResponsePanel = ({ ticketId }) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const result = await invoke('generateResponse', { ticketId });
        setResponse(result.response);
      } catch (err) {
        setError('Error generating response. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [ticketId]);

  return (
    <Card variant="outlined" sx={{ margin: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          AI-Generated Response
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            {response}
          </Typography>
        )}
        {!loading && !error && (
          <FeedbackForm ticketId={ticketId} />
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsePanel;
