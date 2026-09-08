// controllers/authController.js
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be configured and contain at least 32 characters.');
    }
    return secret;
};

exports.register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO users (name, email, password_hash, phone, role) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
            [name, email, hashedPassword, phone, role]
        );
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed or user already exists.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        let jwtSecret;
        try {
            jwtSecret = getJwtSecret();
        } catch (configError) {
            console.error(configError.message);
            return res.status(500).json({ error: 'Authentication service is not configured securely.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            jwtSecret,
            { expiresIn: '24h' }
        );

        res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'Login server error' });
    }
};