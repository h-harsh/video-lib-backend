const express = require('express')
const {dbConnector} = require('./db/db')
const cors = require('cors')
const app = express();
const port = 8080;

app.use(express.json())
app.use(cors());

const videos = require('./Routes/videos.route')
const user = require('./Routes/user.route')
const playlist = require('./Routes/playlist.route')
const history = require('./Routes/history')
const likedVideos = require('./Routes/likedVideo')

dbConnector();

app.use('/videos', videos)
app.use('/user', user)
app.use('/playlist', playlist)
app.use('/history', history)
app.use('/likedVideos', likedVideos)

app.get('/', (req, res) => {
  res.send('Hello This is my videi library API base url !')
});

// For errors and not found pages
app.use((req, res) => {
  res.status(404).json({ success: false, message: "route not found on server, please check"})
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "error occured, see the errMessage key for more details", errorMessage: err.message})
})

app.listen(process.env.PORT || port , () =>  console.log(`listening on port ${port}!`));