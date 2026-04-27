const express = require('express');
const app = express();
const PORT = process.env.PORT || 3007;
const HOST = '0.0.0.0';

app.get('/', (_req, res) => {
  res.json({ service: 'CommerceHubConnectSDK', status: 'ok' });
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

app.listen(PORT, HOST, () => {
  console.log(`SDK server listening on ${HOST}:${PORT}`);
});
