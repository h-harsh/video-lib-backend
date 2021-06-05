const express = require('express')
const {dbConnector} = require('./db/db')
const bodyParser = require('body-parser')
const app = express();
const port = 8000;

app.use(bodyParser.json())

const videos = require('./Routes/videos.route')
const user = require('./Routes/user.route')
// const playlist = require('./Routes/playlist.route')

dbConnector();

app.use('/videos', videos)
app.use('/user', user)
// app.use('/playlist', playlist)

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// For errors and not found pages
app.use((req, res) => {
  res.status(404).json({ success: false, message: "route not found on server, please check"})
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "error occured, see the errMessage key for more details", errorMessage: err.message})
})
app.listen(port, () => {
  console.log(`listening on port ${port}!`)
});