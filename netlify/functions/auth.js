const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    const token = process.env.GITHUB_TOKEN;
    
    // Update YOUR-USERNAME with your actual GitHub username
    const response = await fetch('https://api.github.com/repos/sgwelsh/firemarshal-credentials/contents/credentials.json', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    if (!response.ok) {
      return { statusCode: 401, body: 'Failed to fetch credentials' };
    }
    
    const credentials = await response.json();
    const userExists = credentials.users.find(u => 
      u.username === username && u.password === password
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: !!userExists })
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
