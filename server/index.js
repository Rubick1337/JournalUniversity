/*
*========== Env ==========
*/
require('dotenv').config();
const port = process.env.PORT || 5002;

/*
*========== DB ==========
*/
    
const sequelize = require('./db')
const models = require('./models/index')

/*
*========== Express ==========
*/
const express = require('express');
const app = express();

/*
*========== Middleware ==========
*/
const CLIENT_ORIGIN = 'http://localhost:3000';
const corsOptions = {
    origin: CLIENT_ORIGIN, 
    credentials: true, 
};
const cors = require('cors')
app.use(cors(corsOptions));

app.use(express.json())
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const apiName = process.env.API_NAME
const route = require('./routes/index')
app.use(`/${apiName}`, route)



const errorHandlingMiddleware = require('./middleware/ErrorHandlingMiddleware');
app.use(errorHandlingMiddleware)
/*
*========== Start project ==========
*/
const start = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();


        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        })
    }
    catch(err)
    {
        console.log("INDEX. Ошибка в Start: Error", err)
    }

}
start();
