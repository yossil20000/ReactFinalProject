var mongoose = require('mongoose');
var log = require('debug-level').log('db');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL ?? '', {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })

    log.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    log.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

module.exports =  connectDB;
