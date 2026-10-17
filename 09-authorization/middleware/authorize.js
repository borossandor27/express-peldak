export function authorize(...engedelyezettSzerepkorok) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                hiba: 'Bejelentkezés szükséges!'
            });
        }

        if (!engedelyezettSzerepkorok.includes(req.user.role)) {
            return res.status(403).json({
                hiba: 'Nincs jogosultságod a művelethez!'
            });
        }

        next();
    };
}