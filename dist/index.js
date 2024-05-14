"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require("dotenv").config();
let { CONNECTION_STRING } = process.env;
const client = new pg_1.Client({
    connectionString: CONNECTION_STRING,
});
// creating a users table in the database
function createUsersTable() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const result = yield client.query(`
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);
  `);
        console.log(result);
    });
}
function createAddressesTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new pg_1.Client({
                connectionString: CONNECTION_STRING,
            });
            yield client.connect();
            const result = yield client.query(`
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
        }
        catch (error) {
            console.log("error");
            console.log(error);
        }
    });
}
function insertUsersTable(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new pg_1.Client({
                connectionString: CONNECTION_STRING,
            });
            yield client.connect();
            const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1,$2,$3)
    `;
            const values = [username, email, password];
            const result = yield client.query(query, values);
            console.log("insertion success", result);
        }
        catch (error) {
            console.log("failed");
            console.log(error);
        }
    });
}
function getUserWithEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new pg_1.Client({
                connectionString: CONNECTION_STRING,
            });
            yield client.connect();
            const query = "SELECT * FROM users WHERE email = $1";
            const values = [email];
            const result = yield client.query(query, values);
            if (result.rows.length > 0) {
                console.log("User found:", result.rows[0]);
                return result.rows[0];
            }
            else {
                console.log("No user found with the given email.");
                return null;
            }
        }
        catch (err) {
            console.error("Error during fetching user:", err);
            throw err;
        }
        finally {
            yield client.end();
        }
    });
}
function getUserWithName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new pg_1.Client({
                connectionString: CONNECTION_STRING,
            });
            yield client.connect();
            const query = "SELECT * FROM users WHERE username = $1";
            const values = [name];
            const result = yield client.query(query, values);
            if (result.rows.length > 0) {
                console.log("User found:", result.rows[0]);
                return result.rows[0];
            }
            else {
                console.log("No user found with the given name.");
                return null;
            }
        }
        catch (err) {
            console.error("Error during fetching user:", err);
            throw err;
        }
        finally {
            yield client.end();
        }
    });
}
createAddressesTable();
