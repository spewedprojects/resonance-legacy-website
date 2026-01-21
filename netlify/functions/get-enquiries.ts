import { Handler } from '@netlify/functions';
import { connectDB, Enquiry } from './utils/db';

const handler: Handler = async (event, context) => {
    // Simple check for GET. In a real app, you might want to check a token here.
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        await connectDB();

        // Sort by newest first
        const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                enquiries
            }),
        };
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
        };
    }
};

export { handler };
