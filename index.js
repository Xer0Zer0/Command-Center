
app.get('/status', (req, res) => {
  res.json({ status: 'online', agent: 'aethel-agent' });
});
