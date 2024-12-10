import pool from "../config/database.js";
import TokenHelper from "../helper/token-helper.js";
import PasswordHelper from "../helper/password-helper.js";
import HttpException from "../exceptions/http-exception.js";

export default class AuthService {

    async login(username, password) {
        const client = await pool.connect();
        try {
            const hashedPassword = PasswordHelper.hashPassword(password);
            const result = await client.query(
                "SELECT * FROM users WHERE username = $1 AND password = $2",
                [username, hashedPassword]
            );
            if (result.rows.length === 0) {
                throw new HttpException(401, "Invalid username or password");
            }
            const user = result.rows[0];
            const accessToken = TokenHelper.generateAccessToken({ id: user.id });
            return { accessToken };

        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        } finally {
            client.release();
        }
    }

    async register(username, email, password) {
        const client = await pool.connect();
        try {
            const hashedPassword = PasswordHelper.hashPassword(password);
            const result = await client.query(
                "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
                [username, email, hashedPassword]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error registering:", error);
            throw error;
        } finally {
            client.release();
        }
    }
}