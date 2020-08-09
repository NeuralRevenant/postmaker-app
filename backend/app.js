const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const Post = require('./models/post');

const IMG_TYPES = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = IMG_TYPES[file.mimetype];
        let error = new Error("Invalid Img Type!");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = IMG_TYPES[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

const app = express();

mongoose.connect("mongodb+srv://KC_92:PRNMaiUcvFG3k29q@cluster0.7vzih.mongodb.net/postapp?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected to database");
    }).catch(() => {
        alert("DB Connection Failed!");
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.post("/api/posts", multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(result => { //Post
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                id: result._id,
                title: result.title,
                content: result.content,
                imagePath: result.imagePath
            }
        });
    });
});

app.get('/api/posts', (req, res, next) => {
    Post.find().then(docs => {
        console.log(docs)
        res.status(200).json({
            message: 'Posts fetched!',
            posts: docs
        });
    });
});

app.put('/api/posts/:id', multer({ storage: storage }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Edited Successfully!' });
    });
});


app.get('/api/posts/:id', (req, res, next) => {
    Post.findOne({ _id: req.params.id }).then(doc => {
        console.log(doc);
        res.status(200).json({
            message: 'Post Fetched!',
            post: doc
        });
    });
});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Post Deleted!' });
    });
});

module.exports = app;