require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

router.get('/:q', async (req, res) => {
  console.log(req.params.q);
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.API_KEY,
  });

  const params = {
    q: req.params.q,
    chart: 'mostPopular',
    part: ['contentDetails', 'player'],
  };

  const data = await youtube.videos.list(params, (err, response) => {
    if (err) {
      console.error(err);
      throw (err)
    }
    console.log(response.data.items.length);
    return res.status(200).json({ data: response.data.items })
  });
});

module.exports = router;
