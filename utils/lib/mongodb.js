const mongoose = require('mongoose')

const mongodb = {}

mongodb.initialize = async () => {
    try{
        await mongoose.connect(process.env.DB_URL)
        log.yellow('DB connected!!')
    }catch(error) {
        throw new Error(error)
    }
}

mongodb.mongify = id => mongoose.Schema.Types.ObjectId(id)

module.exports = mongodb
