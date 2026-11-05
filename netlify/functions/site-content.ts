import { Handler } from '@netlify/functions';
import { connectDB, SiteContent } from './utils/db';

const handler: Handler = async (event, context) => {
    // CORS headers for cross-origin or local dev requests
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    try {
        await connectDB();
    } catch (err: any) {
        // Return 200 with fallback flag so frontend gracefully relies on localStorage
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: false,
                fallback: true,
                message: 'Database not connected: ' + err.message,
            }),
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            const requestedKey = event.queryStringParameters?.key;

            if (requestedKey) {
                const item = await SiteContent.findOne({ key: requestedKey });
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        key: requestedKey,
                        data: item ? item.data : null,
                    }),
                };
            }

            // Fetch and return all stored content sections
            const allItems = await SiteContent.find({});
            const contentMap: Record<string, any> = {};
            allItems.forEach((doc) => {
                contentMap[doc.key] = doc.data;
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    content: contentMap,
                }),
            };
        }

        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            const { key, data } = body;

            if (!key || data === undefined) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ success: false, message: 'Missing key or data' }),
                };
            }

            await SiteContent.findOneAndUpdate(
                { key },
                { data },
                { upsert: true, new: true }
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: `Updated content for ${key}` }),
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    } catch (error: any) {
        console.error('Error in site-content function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: error.message || 'Internal Server Error' }),
        };
    }
};

export { handler };
