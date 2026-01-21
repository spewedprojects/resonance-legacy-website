import { Handler } from '@netlify/functions';
import { connectDB, Blog } from './utils/db';

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        await connectDB();

        const slug = event.queryStringParameters?.slug;

        if (slug) {
            const blog = await Blog.findOne({ slug });
            if (!blog) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ success: false, message: 'Blog not found' }),
                };
            }
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, blog }),
            };
        }

        // Fetch all blogs, sorted by newest first
        const blogs = await Blog.find({}).sort({ createdAt: -1 });

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                blogs
            }),
        };
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
        };
    }
};

export { handler };
