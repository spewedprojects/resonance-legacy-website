import { Handler } from '@netlify/functions';
import { connectDB, Enquiry } from './utils/db';

const handler: Handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        await connectDB();
        const data = JSON.parse(event.body || '{}');

        if (!data.name || !data.email || !data.message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Missing required fields' }),
            };
        }

        const newEnquiry = new Enquiry({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
        });

        await newEnquiry.save();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Enquiry submitted successfully'
            }),
        };
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
        };
    }
};

export { handler };
