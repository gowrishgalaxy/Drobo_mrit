# Minimal E-Commerce App

## Architecture
This is a Monorepo setup containing:
1.  **Backend (Node.js/Express):** REST API handling authentication (JWT) and in-memory data storage for products and carts.
2.  **Frontend (React.js):** Single Page Application (SPA) using React Router for navigation and Axios for API consumption.

## Prerequisites
- Node.js installed.

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
Runs on http://localhost:5000

### 2. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000