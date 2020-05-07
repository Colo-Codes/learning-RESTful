// Loading necessary modules:
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// Connecting to mongodb:
mongoose.connect('mongodb://localhost/restful_blog_app');

// Setting up the view engine:
app.set('view engine', 'ejs');

// Serving customised stylesheets:
app.use(express.static('public'));

// Using the body-parser:
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose: Creating a schema in mongoose:
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

// Mongoose: Compile the model:
const Blog = mongoose.model('Blog', blogSchema);

// Mongoose: Test blog post:
// Blog.create({
//     title: 'Test Blog',
//     image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/1175px-Test-Logo.svg.png',
//     body: 'This is a test of a blog post. Delte after use.'
//     // No date, just use the default.
// });

// ++++++++++++++++++++++ RESTful Routes (start) ++++++++++++++++++++++

// Redirection of the root access to the site to the index of it (/blogs)
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// Name: index - Path: /blogs - HTTP verb: GET
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log('Error! ' + err);
        } else {
            res.render('index', {blogs: blogs}); // Renders the index.ejs template
        }
    });
});


// ++++++++++++++++++++++ RESTful Routes (end) ++++++++++++++++++++++++

// Running Node.js server
app.listen('3000', () => {
    console.log('Blog app server running... (port 3000)');
    
});