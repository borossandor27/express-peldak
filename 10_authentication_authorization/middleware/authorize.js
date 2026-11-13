
export default function authorize(...allowedRoles) {

    return (req, res, next) => {

        // Van-e hitelesített felhasználó?
        if (!req.user) {
            return res.status(401).json({
                message: "Először jelentkezz be!"
            });
        }

        // Jogosultság ellenőrzése
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Nincs jogosultságod a művelethez!"
            });
        }

        next();
    };
}
