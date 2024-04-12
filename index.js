const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const shortid = require('shortid');

const app = express();

app.use(express.urlencoded({extended: false}));

 
let shortID = shortid.generate();

// schema for the url
const userSchema = new mongoose.Schema({
    shortURL:{
        type: String,
        required: true,
        unique: true,
    },
    redirectedURL:{
        type: String,
        required: true,
    }

}, {timestamps: true});

const URL = mongoose.model('URL', userSchema);

// connection to database

mongoose.connect('mongodb://localhost:27017/url-shortner')
.then(() => {
    console.log('Connected to database');
})
.catch((err) => { 
    console.log('Error connecting to database', err);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

// post request to create short url
app.post('/url', async(req, res)=>{
    const longURL = req.body.url;
    await URL.create({
        shortURL: shortID, 
        redirectedURL: longURL
    });
    res.send(`Your Short URL is http://localhost:3000/${shortID}`);

})

// get request to redirect to the original url

app.get('/:shortURL', async(req, res) => {
    const shortURL = req.params.shortURL;
    const url = await URL.findOne({shortURL: shortURL});
    res.redirect(url.redirectedURL);
})



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})