const { Pool } = require('pg');

// Setup database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    try {
        // GET all articles
        if (event.httpMethod === 'GET') {
            const result = await pool.query(`
                SELECT * FROM articles 
                WHERE published = true 
                ORDER BY created_at DESC 
                LIMIT 20
            `);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(result.rows)
            };
        }

        // POST new article
        if (event.httpMethod === 'POST') {
            const { title, content, category, author_id } = JSON.parse(event.body);
            
            const result = await pool.query(
                `INSERT INTO articles (title, content, category, author_id) 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [title, content, category, author_id]
            );
            
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(result.rows[0])
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method not allowed' })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};