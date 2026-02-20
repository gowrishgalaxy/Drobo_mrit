async function testAPI() {
  try {
    console.log('🚀 Starting API Tests...\n');

    // 1. Sign up a user
    console.log('1️⃣  Testing SIGNUP...');
    const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'alice',
        email: 'alice@example.com',
        password: 'pass123'
      })
    });
    const signupData = await signupRes.json();
    console.log('Response:', signupData);
    const userId = signupData.userId;
    console.log('✅ User created with ID:', userId, '\n');

    // 2. Login user
    console.log('2️⃣  Testing LOGIN...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@example.com',
        password: 'pass123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Response:', loginData);
    const token = loginData.token;
    console.log('✅ Login successful. Token:', token.substring(0, 20) + '...', '\n');

    // 3. Create a post
    console.log('3️⃣  Testing CREATE POST...');
    const postRes = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'My First Blog Post',
        content: 'This is the content of my first blog post. It\'s about web development and Node.js.'
      })
    });
    const postData = await postRes.json();
    console.log('Response:', postData);
    const postId = postData.post._id;
    console.log('✅ Post created with ID:', postId, '\n');

    // 4. Get all posts
    console.log('4️⃣  Testing GET ALL POSTS...');
    const postsRes = await fetch('http://localhost:5000/api/posts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const postsData = await postsRes.json();
    console.log('Response: Found', postsData.count, 'posts');
    console.log('✅ Posts retrieved successfully\n');

    // 5. Get single post
    console.log('5️⃣  Testing GET SINGLE POST...');
    const singlePostRes = await fetch(`http://localhost:5000/api/posts/${postId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const singlePostData = await singlePostRes.json();
    console.log('Response:', singlePostData.post.title);
    console.log('✅ Single post retrieved successfully\n');

    // 6. Add a comment
    console.log('6️⃣  Testing ADD COMMENT...');
    const commentRes = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: 'Great post! Very informative about Node.js.'
      })
    });
    const commentData = await commentRes.json();
    console.log('Response:', commentData);
    console.log('✅ Comment added successfully\n');

    // 7. Get comments for post
    console.log('7️⃣  Testing GET COMMENTS...');
    const getCommentsRes = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const getCommentsData = await getCommentsRes.json();
    console.log('Response: Found', getCommentsData.count, 'comments');
    console.log('✅ Comments retrieved successfully\n');

    console.log('✅ All tests completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAPI();
