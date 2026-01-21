import { Handler } from '@netlify/functions';
import { connectDB, Blog } from './utils/db';

const handler: Handler = async (event, context) => {
    // In a real app, you would verify a token from the request headers
    const method = event.httpMethod;

    if (!['POST', 'PUT', 'DELETE'].includes(method)) {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        await connectDB();
        const data = JSON.parse(event.body || '{}');

        if (method === 'POST') {
            const newBlog = new Blog(data);
            await newBlog.save();
            return {
                statusCode: 201,
                body: JSON.stringify({ success: true, blog: newBlog }),
            };
        }

        if (method === 'PUT') {
            const { id, ...updateData } = data;
            if (!id) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ success: false, message: 'ID is required' }),
                };
            }
            const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedBlog) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ success: false, message: 'Blog not found' }),
                };
            }
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, blog: updatedBlog }),
            };
        }

        if (method === 'DELETE') {
            const { id } = event.queryStringParameters || {};
            if (!id) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ success: false, message: 'ID is required' }),
                };
            }
            const deletedBlog = await Blog.findByIdAndDelete(id);
            if (!deletedBlog) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ success: false, message: 'Blog not found' }),
                };
            }
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'Blog deleted successfully' }),
            };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid Request' }),
        };

    } catch (error: any) {
        console.error('Error managing blog:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: error.message || 'Internal Server Error' }),
        };
    }
};

export { handler };
