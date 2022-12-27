const express = require('express');
const route = require('./backend/routes/route');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    next();
});


app.use(express.json()); //express.json();
app.use(multer().any());  
app.use('/', route);

require("dotenv").config()

mongoose.connect(process.env.MONGO_URL, {    //
    useNewUrlParser: true
})
    .then(function () {
        console.log("Mongodb is connected successfully.");
    })
    .catch(function (err) {
        console.log(err)
    })


app.listen(process.env.PORT || 4000, function () { return console.log(`Express is running on port${process.env.PORT || 4000}`) });