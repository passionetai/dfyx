const express = require('express');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(__dirname));

// Start server
app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
  console.log('Open http://localhost:3000/test-chat.html to test the static server');
});
