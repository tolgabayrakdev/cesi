import AuthService from "../service/auth-service.js";
import HttpException from "../exceptions/http-exception.js";

const authService = new AuthService();

export default class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const result = await authService.login(username, password);
            res.cookie("accessToken", result.accessToken, { httpOnly: true });
            res.status(200).json({ accessToken: result.accessToken });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.statusCode).send(error.message);
            }
        }
    }
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            await authService.register(username, email, password);
            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.statusCode).send(error.message);
            }
        }
    }
}
