const express = require('express');
const app = express();
const PORT = process.env.PORT || 3007;

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
