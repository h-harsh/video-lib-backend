const mongoose  = require('mongoose')
const data = require('../db/videosData')

const VideosSchema = mongoose.Schema({
    videoId: String,
    title: String,
    views: String,
    author: String,
    authorImg:String,
    likes: String,
    thumbnail: String,
    description: String    
})

const Videos = mongoose.model('Videos', VideosSchema);

// for(let i=0; i< 10; i++){
//   const newProd = new Videos(data[i])
// const savedProd = newProd.save()
// console.log("Hi")
// console.log(savedProd)
// }


module.exports = {Videos}