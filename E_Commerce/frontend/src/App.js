import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000';

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
      if (isLogin) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>{message}</p>
      <button className="link-btn" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
}

function ProductList({ token }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/products`).then(res => setProducts(res.data));
  }, []);

  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_URL}/cart`, { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Added to cart!');
    } catch (err) {
      alert('Error adding to cart');
    }
  };

  return (
    <div className="container">
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart({ token }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCart(res.data));
  };

  const removeFromCart = async (cartItemId) => {
    await axios.delete(`${API_URL}/cart/${cartItemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCart();
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.cartItemId} className="cart-item">
                {item.name} - ${item.price}
                <button onClick={() => removeFromCart(item.cartItemId)} className="remove-btn">Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total}</h3>
        </>
      )}
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const logout = () => { setToken(null); localStorage.removeItem('token'); };
  return (
    <Router>
      <div className="app">
        <nav><h1>SimpleShop</h1>{token && (<div><Link to="/">Products</Link><Link to="/cart">Cart</Link><button onClick={logout}>Logout</button></div>)}</nav>
        <Routes><Route path="/" element={token ? <ProductList token={token} /> : <Navigate to="/login" />} /><Route path="/cart" element={token ? <Cart token={token} /> : <Navigate to="/login" />} /><Route path="/login" element={!token ? <Auth setToken={setToken} /> : <Navigate to="/" />} /></Routes>
      </div>
    </Router>
  );
}
export default App;