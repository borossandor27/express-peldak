
import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {

    const authHeader = req.headers.authorization;

    // Van-e Authorization fejléc?
    if (!authHeader) {
        return res.status(401).json({
            message: "Nincs bejelentkezve!"
        });
    }

    // Bearer token kinyerése
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Hibás token formátum!"
        });
    }

    try {
        // JWT ellenőrzése
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Felhasználói adatok átadása
        req.user = {
            id: decoded.sub,
            role: decoded.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Érvénytelen vagy lejárt token!"
        });
    }
}
