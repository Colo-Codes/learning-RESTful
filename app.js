// Loading necessary modules:
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer');

// Connecting to mongodb:
mongoose.connect('mongodb://localhost/restful_blog_app');

// Setting up the view engine:
app.set('view engine', 'ejs');

// Serving customised stylesheets:
app.use(express.static('public'));

// Using the body-parser:
app.use(bodyParser.urlencoded({extended: true}));

// Using method-override
app.use(methodOverride('_method'));

// Using express-sanitizer (must be after body-parser)
app.use(expressSanitizer());

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

// Name: new - Path: /blogs/new - HTTP verb: GET (Creating the route to show the new blog post creation form)
app.get('/blogs/new', (req, res) => {
    res.render('new'); 
});

// Name: create - Path: /blogs - HTTP verb: POST
app.post('/blogs', (req, res) => {
    // 1st - Create blog
    // Sanitising body (start)
    console.log('***** BEFORE sanitiser: ' + req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log('***** AFTER sanitiser: ' + req.body);
    // Sanitising body (end)
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err) {
            console.log('Error! ' + err);
            res.render('new'); // If error, render the form again
        } else {
            // 2nd - Redirect to the index
            res.redirect('/blogs');
        }
    });
});

// Name: show - Path: /blogs/:id - HTTP verb: GET
app.get('/blogs/:id', (req, res) => {
    //res.send('This is the show page.');
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            console.log('Error! ' + err);
            res.redirect('/blogs'); // If error, redirect to blogs again
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

// Name: edit - Path: /blogs/:id/edit - HTTP verb: GET
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            console.log('Error! ' + err);
            res.redirect('/blogs'); // If error, redirect to blogs again
        } else {
            res.render('edit', {blog: foundBlog});
        }
    });
});

// Name: update - Path: /blogs/:id - HTTP verb: PUT
app.put('/blogs/:id', (req, res) => {
    //res.send('Update route.');
    // Sanitising body (start)
    console.log('***** BEFORE sanitiser: ' + req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log('***** AFTER sanitiser: ' + req.body);
    // Sanitising body (end)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err) {
            console.log('Error! ' + err);
            res.redirect('/blogs'); // If error, redirect to blogs again
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// Name: destroy - Path: /blogs/:id - HTTP verb: DELETE
app.delete('/blogs/:id', (req, res) => {
    //res.send('Destroy route.');
    // 1st Destroy blogpost
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            console.log('Error! ' + err);
            res.redirect('/blogs/:id'); // If error, redirect to the blogpost again
        } else {
            // 2nd Redirect after destroying blogpost
            res.redirect('/blogs/');
        }
    });
});

// ++++++++++++++++++++++ RESTful Routes (end) ++++++++++++++++++++++++

// Running Node.js server
app.listen('3000', () => {
    console.log('Blog app server running... (port 3000)');
    
});