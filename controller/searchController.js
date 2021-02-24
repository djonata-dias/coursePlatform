require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const searchMock = require('../mock/searchMock.json');
const videosListMock = require('../mock/videosListMock.json');
const convertTime = require('../utils/convertTime');
const router = express.Router();

const searchGoogleApi = (params, video) => {
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.API_KEY,
  });
  if (video) {
    const videos = youtube.videos.list(params)
    return videos;
  }
  const list = youtube.search.list(params)
  return list;
};

router.get('/', (_req, res) => {
  res.status(200).render('index', { data: null, details: null });
});

router.post('/', async (req, res) => {
  try {


    const { query, time } = req.body;
    let params = {
      q: query,
      part: ['id'],
      maxResults: 50,
      type: 'video'
    };
    // Requisição que retorna a lista de filmes conforme 
    //const list = await searchList(params);
    const idList = [];
    const videosList = [];
    const weekVideos = [[], [], [], [], [], [], []];
    const search = await searchGoogleApi(params)
    search.data.items.forEach(({ id }) => {
      idList.push(id.videoId);
    });
    params.part = ['snippet', 'contentDetails', 'player'];
    params.id = idList;
    const videosSearch = await searchGoogleApi(params, true)

    videosSearch.data.items.forEach(({ snippet, tags, id, contentDetails }) => {
      const video = {
        id,
        title: snippet.title,
        description: snippet.description,
        duration: +convertTime(contentDetails.duration),
        tags: snippet.tags,
      };
      videosList.push(video);
    })
    let indexList = 0
    let timeCount = 0;
    let totalTime = 0;
    while (indexList < 7) {
      for (let i = 0; i < videosList.length; i++) {
        timeCount += Number(videosList[i].duration);
        if (Number(timeCount) <= Number(time[indexList])) {
          weekVideos[indexList].push(videosList[i]);
          totalTime += Number(videosList[i].duration);
          videosList.splice(i, 1);
        } else {
          break
        }
      }
      indexList += 1;
      timeCount = 0;
    }
    // Requisição que retorna os dados dos filmes da pesquisa 
    //const videos = await searchGoogleApi(params, true);

    // Realizei um mock na resposta da API pois as requisições são muito limitadas
    res.status(200).render('index', { data: weekVideos, details: { totalTime } });
  } catch (error) {
    res.status(500).send({ message: error })
  }
});

module.exports = router;
