require('dotenv').config();
const express = require('express');
const { searchController } = require('./controller');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (_res, req) => {
  req.redirect('/search')
});

app.use('/search', searchController);

app.get('*', (_req, res) => {
  res.status(404);
  res.render('notFound');
});

app.listen(PORT, () => {
  console.log('server running');
});
