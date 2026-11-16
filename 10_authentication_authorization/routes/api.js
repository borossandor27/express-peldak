
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// AUTHENTICATION
// Bejelentkezés
router.post("/login", async (req, res) => {

    const { username, password } = req.body;

    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: "Hiányzó vagy hibás adatok!"
        });
    }

    // Felhasználó keresése - élesben az adatbázisból vesszük az adatokat
    const user = req.app.locals.users.find(
        u => u.username === username
    );

    if (!user) {
        return res.status(401).json({
            message: "Hibás felhasználónév vagy jelszó!"
        });
    }

    // Jelszó ellenőrzése
    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        return res.status(401).json({
            message: "Hibás felhasználónév vagy jelszó!"
        });
    }

    // JWT létrehozása. 
    const token = jwt.sign(
        {
            role: user.role
        },
        process.env.JWT_SECRET, // szakirodalomban PEPPER
        {
            subject: String(user.id),
            expiresIn: "1h"
        }
    );

    res.json({
        message: "Sikeres bejelentkezés!",
        token
    });
});


// AUTHENTICATION
// Minden bejelentkezett felhasználó elérheti
router.get("/profil",
    authenticate,
    (req, res) => {

        res.json({
            message: "Sikeres hozzáférés a profilhoz!",
            user: req.user
        });
    }
);


// AUTHENTICATION + AUTHORIZATION
// Csak admin érheti el
router.get("/admin",
    authenticate,
    authorize("admin"),
    (req, res) => {

        res.json({
            message: "Üdvözöllek az admin felületen!",
            user: req.user
        });
    }
);


// Több szerepkör is engedélyezett
router.get("/tananyag",
    authenticate,
    authorize("admin", "user"),
    (req, res) => {

        res.json({
            message: "A tananyag elérhető!",
            user: req.user
        });
    }
);

export default router;
