// Update the import to use default import syntax
import pkg from '../static/hello-world/src/api/aiBackend.js';

const { fetchAIResponse } = pkg;

const testFetchAIResponse = async () => {
    const testInput = {
        subject: "Test Subject",
        description: "This is a sample description for testing.",
        context: [
            "User mentioned slow system performance.",
            "Admin reported a crash in the morning.",
        ],
    };

    try {
        const result = await fetchAIResponse(testInput);
        console.log("AI Response:", result.suggestedResponse);
    } catch (error) {
        console.error("Test failed with error:", error.message);
    }
};

testFetchAIResponse();
