const moongoose = require('mongoose');
require('dotenv').config();
// This function connects to the database
const dbconnnect = async () => {
    try {
        // Connect to the database using the provided credentials and options
        await moongoose.connect(`${process.env.MONGO_URI}${process.env.DBPASS}@nodejscrud.1p0kk.mongodb.net/${process.env.DBNAME}`, {
            retryWrites:true,
            w:"majority",
            appName:"nodejscrud"
        })
        // Log a message if the connection is successful
        console.log('connected to db')
    } catch (error) {
        // Log an error message if the connection fails
        console.log(error)
        process.exit(1);
    }
}

module.exports = dbconnnect