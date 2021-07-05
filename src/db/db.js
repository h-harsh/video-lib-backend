const mongoose = require('mongoose')

async function dbConnector() {
  try{
    await mongoose.connect('mongodb+srv://Adminsat:Contract1236@neog-cluster.ceqpa.mongodb.net/VideoLibrary?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("Connected To Database")
  } catch(error) {
    console.log(error, "error connecting to database")
  }
  
}

module.exports = {dbConnector}