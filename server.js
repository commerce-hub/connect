const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3007;

// Serve the SDK file directly at /CommerceHubConnectSDK.js
app.get('/CommerceHubConnectSDK.js', (_req, res) => {
  const sdkPath = path.join(__dirname, 'public', 'sdk', 'CommerceHubConnectSDK.js');
  res.sendFile(sdkPath, err => {
    if (err) {
      res.status(404).send('SDK file not found');
    }
  });
});

// Optionally, redirect / to the SDK file or provide a simple HTML loader
app.get('/', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><title>CommerceHubConnectSDK</title></head><body>
<script src="/CommerceHubConnectSDK.js"></script>
<p>SDK is loaded. Check the browser console or use the SDK in your app.</p>
</body></html>`);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/sdk', express.static('public/sdk', {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  }
}));

app.listen(PORT, () => {
  console.log(`SDK server listening on port ${PORT}`);
});
