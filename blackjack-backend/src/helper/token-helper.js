import jsonwebtoken from "jsonwebtoken";


class TokenHelper {
    generateAccessToken(payload) {
        return jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY || "secret", {
            expiresIn: "1h",
        });
    }
    verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY || "secret");
            return decoded
        } catch (error) {
            throw new Error(error);
        }
    }
}
export default TokenHelper