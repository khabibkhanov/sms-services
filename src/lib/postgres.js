// Import the `Pool` class from the `pg` library, which provides a connection pool for making queries to a PostgreSQL database
const { Pool } = require('pg');

// Import the `pgConfig` object from a separate config file
const { pgConfig } = require('../config');

// Create a new `Pool` instance using the `pgConfig` object
const pool = new Pool(pgConfig);

// Define two async functions for making queries to the database: `fetch` for retrieving a single row of data, and `fetchAll` for retrieving multiple rows of data
const fetch = async (sqlQuery, ...params) => {
	const client = await pool.connect(); // Get a connection from the connection pool
	
	try {
		const { rows: [ row ] } = await client.query(sqlQuery, params.length ? params : null); // Execute the SQL query with optional parameters, and extract the first (and only) row from the result set
		return row; // Return the row data
	} catch(error) {
		return error; // If an error occurs, return the error object
	} finally {
		await client.release(); // Release the client connection back to the connection pool, regardless of whether there was an error or not
	}
};

const fetchAll = async (sqlQuery, ...params) => {
	const client = await pool.connect(); // Get a connection from the connection pool
	
	try {
		const { rows } = await client.query(sqlQuery, params.length ? params : null); // Execute the SQL query with optional parameters, and extract all rows from the result set
		return rows; // Return the array of rows
	} catch(error) {
		return error; // If an error occurs, return the error object
	} finally {
		await client.release(); // Release the client connection back to the connection pool, regardless of whether there was an error or not
	}
};

// Export the `fetch` and `fetchAll` functions for use in other modules
module.exports = { fetch, fetchAll };
