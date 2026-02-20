# API Testing Guide

Your Blog API is running on `http://localhost:5000`

## Using Postman or API Client

Instead of PowerShell (which may have networking issues), use:
1. **Postman** - Download from [postman.com](https://www.postman.com/downloads/)
2. **VS Code REST Client** - Extension `humao.rest-client`
3. **Thunder Client** - VS Code Extension

## API Endpoints

### 1. Sign Up
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
**Response includes JWT token** - Copy this for authenticated requests

### 3. Create a Post
```
POST http://localhost:5000/api/posts
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post..."
}
```

### 4. Get All Posts
```
GET http://localhost:5000/api/posts
```

### 5. Add Comment
```
POST http://localhost:5000/api/posts/:postId/comments
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "content": "Great post!"
}
```

Replace `:postId` with actual post ID from step 4.

## Using Node fetch

Create `test-api.js`:
```javascript
async function testAPI() {
  // Signup
  const signup = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'alice',
      email: 'alice@example.com',
      password: 'pass123'
    })
  });
  console.log('Signup:', await signup.json());

  // Login
  const login = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'alice@example.com',
      password: 'pass123'
    })
  });
  const loginData = await login.json();
  console.log('Login:', loginData);
  const token = loginData.token;

  // Create Post
  const post = await fetch('http://localhost:5000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Hello World',
      content: 'This is my first blog post content!'
    })
  });
  console.log('Post Created:', await post.json());
}

testAPI();
```

Run: `node test-api.js`
