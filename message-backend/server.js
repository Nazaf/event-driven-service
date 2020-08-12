const express = require('express');
const bodyparser = require('body-parser');
const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');

const userRoutes = require('./src/routes/user.routes');

mongoose.Promise = global.Promise;

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
  }).then(() => {
    console.log("Successfully connected to the database");
  }).catch(err => {
    console.log('Could not connect to the database.', err);
    process.exit();
  });

app.get('/', (req, res) => {
  res.json({ 'message': "Hello World!"});
});

app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Node server is listening on port ${port}`);
})