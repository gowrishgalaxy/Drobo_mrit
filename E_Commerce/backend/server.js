require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

app.use(cors());
app.use(bodyParser.json());

// --- IN-MEMORY DATABASE ---
const users = [];
const products = [
    { id: 1, name: 'DJI Air 3S Pro', price: 1299, image: 'https://images.pexels.com/photos/4195300/pexels-photo-4195300.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 2, name: 'Autel EVO Max 4T', price: 1599, image: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 3, name: 'Skydio 3', price: 2499, image: 'https://images.pexels.com/photos/4195326/pexels-photo-4195326.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 4, name: 'DJI Mini 4 Pro', price: 759, image: 'https://images.pexels.com/photos/4195327/pexels-photo-4195327.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 5, name: 'Freefly Alta X', price: 3299, image: 'https://images.pexels.com/photos/4195328/pexels-photo-4195328.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 6, name: 'DJI Avata 3', price: 899, image: 'https://images.pexels.com/photos/4195329/pexels-photo-4195329.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 7, name: 'Parrot Anafi AI', price: 799, image: 'https://images.pexels.com/photos/4195330/pexels-photo-4195330.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 8, name: 'DJI Air 3', price: 999, image: 'https://images.pexels.com/photos/4195331/pexels-photo-4195331.jpeg?auto=compress&cs=tinysrgb&w=400' },
];
const carts = {};

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- ROUTES ---
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) return res.status(400).json({ message: 'User already exists' });
    users.push({ username, password });
    carts[username] = [];
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username });
});

app.get('/products', (req, res) => res.json(products));

app.get('/cart', authenticateToken, (req, res) => {
    res.json(carts[req.user.username] || []);
});

app.post('/cart', authenticateToken, (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!carts[req.user.username]) carts[req.user.username] = [];
    carts[req.user.username].push({ ...product, cartItemId: Date.now() });
    res.json(carts[req.user.username]);
});

app.delete('/cart/:cartItemId', authenticateToken, (req, res) => {
    const { cartItemId } = req.params;
    const username = req.user.username;
    if (carts[username]) carts[username] = carts[username].filter(item => item.cartItemId != cartItemId);
    res.json(carts[username] || []);
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));