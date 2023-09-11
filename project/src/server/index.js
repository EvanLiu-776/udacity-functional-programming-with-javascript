require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const curiosity_rover = require('./curiosity.json');
const curiosity_img = require('./curiosity_2023-09-08.json');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/rovers', async (req, res) => {
    const roverName = req.query.rover_name
    if (!roverName) {
        const error = new Error('Missing Parameters');
        error.status = 400
        res.status(error.status).json({ error: error.message });
    }

    // res.send(curiosity_rover);

    try {
        let rover = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send(rover)
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/roverimage', async (req, res) => {
    const roverName = req.query.rover_name
    const earthDate = req.query.earth_date
    if (!roverName || !earthDate) {
        const error = new Error('Missing Parameters');
        error.status = 400
        res.status(error.status).json({ error: error.message });
    }
    // res.send({ photo: curiosity_img.photo.img_src });

    try {
        let { photos } = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?earth_date=${earthDate}&api_key=${process.env.API_KEY}&page=1`)
            .then(res => res.json())
        res.send({ photo: photos[0].img_src })
    } catch (err) {
        console.log('error:', err);
    }
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))