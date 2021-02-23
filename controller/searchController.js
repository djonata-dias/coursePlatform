require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

const searchList = (params) => {
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.API_KEY,
  });
  const list = youtube.search.list(params)
  return list;
};

router.get('/:query', async (req, res) => {
  data = [];
  const params = {
    q: req.params.query,
    part: ['id'],
    maxResults: 50,
    type: 'video'
  };
  const videos = await searchList(params);

  res.status(200).json(videos);
});

module.exports = router;
