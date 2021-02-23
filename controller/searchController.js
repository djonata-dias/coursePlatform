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

// router.get('/', (req, res) => {
//   res.status(200).render('index');
// });

router.get('/', async (req, res) => {
  const { query, weekTime } = req.body;
  let params = {
    q: query,
    part: ['id'],
    maxResults: 50,
    type: 'video'
  };
  const timeList = [15, 120, 30, 150, 20, 40, 90]
  // Requisição que retorna a lista de filmes conforme 
  //const list = await searchList(params);
  const idList = [];
  const videosList = [];
  const weekVideos = [[], [], [], [], [], [], []];

  searchMock.data.items.forEach(({ id }) => {
    idList.push(id.videoId);
  });
  params.part = ['snippet', 'contentDetails', 'player'];
  params.id = idList;

  videosListMock.data.items.forEach(({ snippet, tags, player, contentDetails }) => {
    const video = {
      title: snippet.title,
      description: snippet.description,
      duration: +convertTime(contentDetails.duration),
      tags,
      player
    };
    videosList.push(video);
  })
  let indexList = 0
  let time = 0;
  while (indexList < 7) {
    for (let i = 0; i < videosList.length; i++) {
      time += Number(videosList[i].duration);
      if (Number(time) <= Number(timeList[indexList])) {
        weekVideos[indexList].push(videosList[i]);
        videosList.splice(i, 1);
      } else {
        break
      }
    }
    indexList += 1;
    time = 0;
  }
  // Requisição que retorna os dados dos filmes retornados na pesquisa 
  //const videos = await searchGoogleApi(params, true);

  // Realizei um mock na resposta da API pois as requisições são muito limitadas
  res.status(200).json(weekVideos);
});

module.exports = router;

console.log(7.97 <= 30);