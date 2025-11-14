// Debug function to check the API key
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        found: false,
        message: 'OPENAI_API_KEY not found'
      })
    };
  }

  // Show first 20 and last 10 characters, check for hidden characters
  const first20 = apiKey.substring(0, 20);
  const last10 = apiKey.substring(apiKey.length - 10);
  const length = apiKey.length;

  // Check for non-ASCII characters
  const nonAscii = [];
  for (let i = 0; i < apiKey.length; i++) {
    const code = apiKey.charCodeAt(i);
    if (code > 127) {
      nonAscii.push({ index: i, charCode: code, char: apiKey[i] });
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      found: true,
      length: length,
      expectedLength: 164, // Typical OpenAI key length
      first20: first20,
      last10: last10,
      nonAsciiChars: nonAscii,
      hasNonAscii: nonAscii.length > 0
    }, null, 2)
  };
};
