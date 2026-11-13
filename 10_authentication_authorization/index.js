
import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import apiRoutes from "./routes/api.js";

dotenv.config();

const app = express();

app.use(express.json());

// Demo felhasználók
const users = [
    {
        id: 1,
        username: "tanulo",
        password: "123456",
        role: "user"
    },
    {
        id: 2,
        username: "admin",
        password: "admin123",
        role: "admin"
    }
];

// Jelszavak hash-elése induláskor
for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
}

// A felhasználók elérhetővé tétele a route-ok számára
app.locals.users = users;

app.use("/api", apiRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Szerver elindult: http://localhost:3000");
});
