require('dotenv').config();
const express = require('express');
const { searchController } = require('./controller');
const bodyParser = require('body-parser');


const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use('/search', searchController);
app.get('*', (_req, res) => {
  res.status(404).json({ message: 'Page not found' })
});

app.listen(PORT, () => {
  console.log('server running');
});
