// Simple proxy server for the Block Check Roblox stats tracker.
// Runs server-side, so it isn't subject to browser CORS restrictions
// when it talks to Roblox's public API.

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Resolve a username -> Roblox user object
app.get('/api/resolve', async (req, res) => {
  const username = (req.query.username || '').trim();
  if (!username) {
    return res.status(400).json({ error: 'Missing "username" query param.' });
  }

  try {
    const robloxRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true })
    });

    if (!robloxRes.ok) {
      return res.status(502).json({ error: 'Roblox lookup failed.' });
    }

    const data = await robloxRes.json();
    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ error: 'No player found with that username.' });
    }

    res.json(data.data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while resolving username.' });
  }
});

// Get friends/followers/following counts for a user ID
app.get('/api/stats/:id', async (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid user id.' });
  }

  try {
    const [followersRes, followingRes, friendsRes] = await Promise.all([
      fetch(`https://friends.roblox.com/v1/users/${id}/followers/count`),
      fetch(`https://friends.roblox.com/v1/users/${id}/followings/count`),
      fetch(`https://friends.roblox.com/v1/users/${id}/friends/count`)
    ]);

    const followers = followersRes.ok ? (await followersRes.json()).count : null;
    const following = followingRes.ok ? (await followingRes.json()).count : null;
    const friends = friendsRes.ok ? (await friendsRes.json()).count : null;

    res.json({ followers, following, friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching stats.' });
  }
});

app.listen(PORT, () => {
  console.log(`Block Check proxy running at http://localhost:${PORT}`);
});
