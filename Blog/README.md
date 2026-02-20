# Blog System API

A simple blog system API built with Node.js, Express, and MongoDB that supports user authentication, blog posts, and comments.

## Features

- User signup and login with JWT authentication
- Create and fetch blog posts
- Add and retrieve comments on posts
- Full relationship management between users, posts, and comments
- Input validation and error handling

## Database Schema

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required, min 3 chars),
  email: String (unique, required),
  password: String (required, hashed, min 6 chars),
  createdAt: Date
}
```

#### Posts Collection
```javascript
{
  _id: ObjectId,
  title: String (required, min 5 chars),
  content: String (required, min 10 chars),
  author: ObjectId (ref: User),
  comments: [ObjectId] (ref: Comment),
  createdAt: Date,
  updatedAt: Date
}
```

#### Comments Collection
```javascript
{
  _id: ObjectId,
  content: String (required),
  author: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  createdAt: Date
}
```

## Relationships

- **User → Posts**: One-to-Many (A user can create multiple posts)
- **User → Comments**: One-to-Many (A user can write multiple comments)
- **Post → Comments**: One-to-Many (A post can have multiple comments)

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Sign Up
- **POST** `/api/auth/signup`
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** User ID and success message

#### Login
- **POST** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** JWT token and user information

### Post Routes (`/api/posts`)

#### Create a Post
- **POST** `/api/posts`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "My First Blog Post",
    "content": "This is the content of my blog post..."
  }
  ```
- **Response:** Created post with author details

#### Fetch All Posts
- **GET** `/api/posts`
- **Response:** Array of all posts with their comments and author details

#### Fetch Single Post
- **GET** `/api/posts/:postId`
- **Response:** Single post with all its comments

### Comment Routes (`/api/posts`)

#### Add Comment to Post
- **POST** `/api/posts/:postId/comments`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "content": "Great post! Thanks for sharing."
  }
  ```
- **Response:** Created comment with author details

#### Get Comments for a Post
- **GET** `/api/posts/:postId/comments`
- **Response:** Array of all comments for the post

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blog_db
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   ```

3. **Ensure MongoDB is running:**
   ```bash
   # If using local MongoDB
   mongod
   ```

4. **Start the server:**
   ```bash
   npm start          # Production mode
   npm run dev        # Development mode with auto-reload
   ```

   The server will start on `http://localhost:5000`

5. **Verify server is running:**
   ```bash
   curl http://localhost:5000/health
   ```

## Validation Rules

### User Validation
- Username: Minimum 3 characters, must be unique
- Email: Must be valid email format, must be unique
- Password: Minimum 6 characters (hashed with bcryptjs)

### Post Validation
- Title: Minimum 5 characters, required
- Content: Minimum 10 characters, required
- Author: Must be a valid authenticated user

### Comment Validation
- Content: Required (minimum 1 character)
- Author: Must be a valid authenticated user
- Post: Must be a valid existing post

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User logs in and receives a token
2. Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. Token expires after 7 days

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `404`: Not Found
- `500`: Server Error

Error responses include a message explaining the issue.

## Example Usage

### 1. Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is an interesting blog post about web development."
  }'
```

### 4. Fetch All Posts
```bash
curl http://localhost:5000/api/posts
```

### 5. Add a Comment
```bash
curl -X POST http://localhost:5000/api/posts/<postId>/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "content": "Great post!"
  }'
```

## Project Structure

```
blog-api/
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
├── routes/
│   ├── auth.js
│   ├── posts.js
│   └── comments.js
├── middleware/
│   └── auth.js
├── server.js
├── package.json
├── .env
└── README.md
```

## Security Notes

- Passwords are hashed using bcryptjs before storage
- JWT tokens are signed with a secret key
- Change `JWT_SECRET` in `.env` for production
- Use environment variables for sensitive data
- Validate and sanitize all user inputs

## Future Enhancements

- Update and delete posts/comments
- User profile management
- Post likes/reactions
- Search and filter functionality
- Pagination for posts
- Email verification
- Rate limiting
- Request logging

## License

ISC
