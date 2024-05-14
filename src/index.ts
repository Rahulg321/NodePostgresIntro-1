import { Client } from "pg";
require("dotenv").config();

let { CONNECTION_STRING } = process.env;

const client = new Client({
  connectionString: CONNECTION_STRING,
});

// creating a users table in the database

async function createUsersTable() {
  await client.connect();
  const result = await client.query(`
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);
  `);
  console.log(result);
}

async function createAddressesTable() {
  try {
    const client = new Client({
      connectionString: CONNECTION_STRING,
    });
    await client.connect();
    const result = await client.query(`
        CREATE TABLE addresses (
        id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100) NOT NULL,
          street VARCHAR(255) NOT NULL,
          pincode VARCHAR(20),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        `);
    console.log("result ", result);
  } catch (error) {
    console.log("error");
    console.log(error);
  }
}

async function insertUsersTable(
  username: string,
  email: string,
  password: string
) {
  try {
    const client = new Client({
      connectionString: CONNECTION_STRING,
    });
    await client.connect();

    const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1,$2,$3)
    `;
    const values = [username, email, password];
    const result = await client.query(query, values);
    console.log("insertion success", result);
  } catch (error) {
    console.log("failed");
    console.log(error);
  }
}

async function getUserWithEmail(email: string) {
  try {
    const client = new Client({
      connectionString: CONNECTION_STRING,
    });
    await client.connect();
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      console.log("User found:", result.rows[0]);
      return result.rows[0];
    } else {
      console.log("No user found with the given email.");
      return null;
    }
  } catch (err) {
    console.error("Error during fetching user:", err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getUserWithName(name: string) {
  try {
    const client = new Client({
      connectionString: CONNECTION_STRING,
    });
    await client.connect();
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [name];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      console.log("User found:", result.rows[0]);
      return result.rows[0];
    } else {
      console.log("No user found with the given name.");
      return null;
    }
  } catch (err) {
    console.error("Error during fetching user:", err);
    throw err;
  } finally {
    await client.end();
  }
}

createAddressesTable();
