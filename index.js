const express = require('express');
const cors  = require('cors');
const { dbConnection } = require('./database/config');
const { path } = require('path');
require('dotenv').config();
console.log(process.env.PORT);

const app = express();

dbConnection();

// directorio publico

app.use(express.static('public'))

app.use(cors());

//lectura y parseo del body
app.use( express.json() );

app.use('/api/auth', require('./routes/auth'))

// las demas rutaaaas (angular)
app.get('*', (req, res) =>{
    res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

app.listen(process.env.PORT, () =>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT} ` );
})