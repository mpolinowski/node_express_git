#A Node/Express Library App with MongoDB (Training)


 This code is part of a training in web development with **Node.js**. **EJS** will be used as template engine for rendering HTML out of **Express**. The library application will use **MongoDB** to store information about books and authors - but will also employ the [GoodReads API](https://www.goodreads.com/api) to provide more details on each. **Passport.js** is used for local security.

This App was created in several steps:

1. [Install Node.js and Express.js to serve our Web Application](#1-install-nodejs-and-expressjs-to-serve-our-web-application)
2. [Add Start Script](#2-add-start-script)
3. [Add Routing (Hello World)](#3-add-routing-hello-world)
4. [Serve Static Files](#4-serve-static-files)
5. [Add Bower to the Project](#5-add-bower-to-the-project)
6. [Add Gulp to the Project](#6-add-gulp-to-the-project)
  * [Inject Bower Dependencies with Wiredep](#inject-bower-dependencies-with-wiredep)
  * [Inject with Gulp-Inject](#inject-with-gulp-inject)
  * [Auto-restart with Nodemon](#auto-restart-with-nodemon)
7. [Add a Templating Engine - EJS](#7-add-a-templating-engine---ejs)
8. [Adding a Page Navigation with Routing](#8-adding-a-page-navigation-with-routing)
9. [Adding a Router for the Listview of our Book Page](#9-adding-a-router-for-the-listview-of-our-book-page)
  * [Adding a Route to Render](#adding-a-route-to-render)
  * [Adding some Books to the Book View](#adding-some-books-to-the-book-view)
10. [Cleaning up app.js with Routers](#10_cleaning_up_the_app_file_with_routers)
11. [Creating a Single Book by ID Route & View](#11-creating-a-single-book-by-id-route--view)
12. [Cleaning up our routes by creating a variable for the NAV element](#12-cleaning-up-our-routes-by-creating-a-variable-for-the-nav-element)
13. [Adding MongoDB](#13-adding-mongodb)
14.


### 1 Install Node.js and Express.js to serve our Web Application
___

First install [Node.js](https://nodejs.org/en/download/) and initialize the project with *npm init*. Then *npm install express --save* to the app directory.

**app.js**

Run the Express webserver on a specified port.

```javascript
var express =require('express');

var app = express():

var port = 3000;

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```

Running the app with *node app.js* should give you the console log that the webserver is up an running on the specified port.


### 2 Add Start Script
___

**package.json**

```json

{
  "name": "node-express",
  "version": "1.0.0",
  "description": "Library App",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js"
  }
}
```

The line *"start": "node app.js"* allows us to use the **npm start** command instead of having to define our starting point like before - *node app.js*


### 3 Add Routing (Hello World)
___

**app.js**

When accessing the home route (*http://localhost:3000/*), we want to send a **Hello World**, to test our routing. Then we add another route - */books*.

```javascript
var express =require('express');

var app = express():

var port = 3000;

app.get('/', function(req, res){
  res.send('Hello World')
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```


### 4 Serve Static Files
___

We first add to new folders to our project - **public/css & public/js** and a **src/views** folder. We download a free Bootstrap theme from a page like bootstrapzero.com and put the css/js files into the public folder. The html file has to be located in the views folder.

**app.js**

The Express middleware is used to serve the content of our public folder, by adding the line *app.use(express.static('public'));* to the app.js file. The static html file - index.html - from our template, will be served by *app.use(express.static('src/views'));*.

```javascript
var express =require('express');

var app = express();

var port = 3000;

app.use(express.static('public'));
app.use(express.static('src/views'));

app.get('/', function(req, res){
  res.send('Hello World')
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```

Through the public route, we are now able to access the css/js files by typing in e.g. http://localhost:3000/css/styles.css into our browser (the bootstrap components of the template will not be used - we Bower to add them later - **DELETE THOSE FILES FOR STEP 6**). The index.html is accessible by http://localhost:3000/index.html.


### 5 Add Bower to the Project
___

First install Bower globally with *npm install bower -g*. Then do a *bower init* to the app directory (creation of **bower.json**).

We now add a new file to tell Bower to install directly into our public directory:

**.bowerrc**


```javascript
"directory": "public/lib"
```

Next we *bower install bootstrap font-awesome --save* to get the latest stable version of the framework (add *bower_components* bootstrap + jquery). They will be installed to the lib directory in our public folder. The bootstrap/jquery/font-awesome files can now be added to the template index.html by linking e.g. *<link href="lib/dist/css/bootstrap.min.css" rel="stylesheet">*.



### 6 Add Gulp to the Project
___

#### Inject Bower Dependencies with Wiredep

First install Gulp with *npm install -g gulp* globally. Then install it to the app directory via *npm install --save-dev gulp* (as a development dependency). We now want to inject dependencies (css,js) to our views automatically with **wiredep** - *npm install --save-dev wiredep*.

We now add a new file to tell Gulp what to do - ignore node_modules only use files from the src directory, add dependencies with wiredep.

**gulpfile.js**

```javascript
var gulp = require('gulp');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream; /* Use wiredep to inject css/js dependencies to views e.g. bootstrap */

    var options = {
        bowerJson: require('./bower.json'), /* Tell wiredep to check dependencies from the bower.json file e.g. bootstrap */
        directory: './public/lib', /* Tell wiredep to find dependencies in the lib directory. It will search for the json file - e.g. ./public/lib/bootstrap/.bower.json */
        ignorePath: '../../public' /* The path to the css/js files has to be given relative to the public folder - e.g. (../../public/)/lib/bootstrap/dist/css/bootstrap.min.css*/
    };

    return gulp.src('./src/views/*.html')
        .pipe(wiredep(options))
        .pipe(gulp.dest('./src/views'));
});
```

Bootstrap 3 now uses LESS - we have to override the defaults to grab the CSS files instead and add them to our index.html. The main **overrides** can be added to the global bower.json file. This way the bower.json file inside public/lib/bootstrap and public/lib/font-awesome will be ignored.

**bower.json**

```json
{
  "name": "node-express",
  "description": "node express test",
  "main": "app.js",
  "authors": [
    "[object Object]"
  ],
  "license": "MIT",
  "homepage": "",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "dependencies": {
    "bootstrap": "^3.3.6",
    "font-awesome": "^4.6.1"
  },
  "overrides": {
    "bootstrap": {
      "main": [
        "dist/js/bootstrap.js",
        "dist/css/bootstrap.min.css",
        "dist/less/bootstrap.less"
      ]
    },
    "font-awesome": {
      "main": [
        "less/font-awesome.less",
        "css/font-awesome.min.css",
        "scss/font-awesome.scss"
      ]
    }
  }
}
```

**index.html**

We now have to add <!--bower:css--> and <!--bower:js--> to our index.html template to inject the Bower css/js dependencies, when the command *gulp inject* is run.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <title>LibraryApp</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <!--bower:css-->
    <link rel="stylesheet" href="/lib/bootstrap/dist/css/bootstrap.min.css" /> <!-- Will be automatically injected with the command "gulp inject" -->
    <link rel="stylesheet" href="/lib/font-awesome/css/font-awesome.min.css" /> <!-- Will be automatically injected with the command "gulp inject" -->
    <!--endbower-->
    <!-- bower:js -->
    <script src="/lib/jquery/dist/jquery.js"></script>  <!-- Will be automatically injected with the command "gulp inject" -->
    <script src="/lib/bootstrap/dist/js/bootstrap.js"></script> <!-- Will be automatically injected with the command "gulp inject" -->
    <!-- endbower -->
</head>
```


#### Inject with Gulp-Inject

After injecting the Bower dependencies, we now have to inject our ccs and js files from the public folder. We will use **Gulp-Inject** to perform this task. First do a *npm install --save-dev gulp inject*, to install Gulp-Inject as a development dependency.

We now add Gulp-Inject to our gulpfile.js:

**gulpfile.js**

```javascript
var gulp = require('gulp');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject'); /* Use gulp-inject to inject our personal css/js dependencies to views */

    var injectSrc = gulp.src(['./public/css/*.css', /* Tell gulp-inject where our personal css/js dependencies are located */
        './public/js/*.js'
    ], {
        read: false /* We only need the path not content */
    });

    var injectOptions = {
        ignorePath: '/public' /* Tell gulp-inject to use a path relative to /public */
    };

    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../public'
    };

    return gulp.src('./src/views/*.html')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions)) /* Use gulp-inject to inject our personal css/js dependencies to views */
        .pipe(gulp.dest('./src/views'));
});
```

We now have to add <!--inject:css--> and  <!--inject:js--> to our index.html template to inject our css/js dependencies, when the command *gulp inject* is run.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <title>LibraryApp</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <!--bower:css-->
    <link rel="stylesheet" href="/lib/bootstrap/dist/css/bootstrap.min.css" /> <!-- Will be automatically injected with the command "gulp inject" -->
    <link rel="stylesheet" href="/lib/font-awesome/css/font-awesome.min.css" /> <!-- Will be automatically injected with the command "gulp inject" -->
    <!--endbower-->
    <!-- bower:js -->
    <script src="/lib/jquery/dist/jquery.js"></script>  <!-- Will be automatically injected with the command "gulp inject" -->
    <script src="/lib/bootstrap/dist/js/bootstrap.js"></script> <!-- Will be automatically injected with the command "gulp inject" -->
    <!-- endbower -->
    <!-- inject:css-->
    <link rel="stylesheet" href="/css/styles.css"> <!-- Will be automatically injected with the command "gulp inject" -->
    <!-- endinject-->
    <!--inject:js-->
    <script src="/js/default.js"></script> <!-- Will be automatically injected with the command "gulp inject" -->
    <!--endinject-->
    <!--[if lt IE 9]>
			<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
</head>
```


#### Auto-restart with Nodemon

We now add **Nodemon** to monitor our node.js app - Nodemon will automatically restart the server when a change was detected. To install Nodemon type *npm install --save-dev nodemon*.

We now add Nodemon to our gulpfile.js:

**gulpfile.js**

```javascript
var gulp = require('gulp');
var nodemon = require('gulp-nodemon'); /* Add nodemon to automatically restart the server, when a change was detected */

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./public/css/*.css',
        './public/js/*.js'
    ], {
        read: false
    });

    var injectOptions = {
        ignorePath: '/public'
    };

    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../public'
    };

    return gulp.src('./src/views/*.html')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src/views'));
});

gulp.task('serve', ['inject'], function() { /* Create a 'serve' task to automatically execute the 'inject' function above on start-up */
    var options = { /* In the line above we used an Object for the 'inject' function - here you can add more functions to be executed */
        script: 'app.js',  /* 'serve' starts our app.js on 'PORT' and nodemon restarts it when 'jsFiles' are changed */
        delayTime: 1,
        env: {
            'PORT': 8080  /* Environment variables e.g. database connection strings */
        },
        watch: jsFiles
    };

    return nodemon(options)
        .on('restart', function(ev) {
            console.log('Restarting...');
        });
});
```


### 7 Add a Templating Engine - EJS
___

EJS combines data and a template to produce HTML. JavaScript between <% %> is executed. JavaScript between <%= %> adds strings to your HTML and <%- %> can contain HTML formated content. To add our templating engine we first have to install it with *npm install --save ejs*. Now we add the engine to our app.js file:

**app.js**

```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000; /* 'gulp serve' uses PORT 8080 - if no port is defined by the environment use port 3000 */

app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'ejs'); /* Templating Engine is set to EJS */

app.get('/', function(req, res){
  res.render('index', {title: 'Rendered Title', list: ['a', 'b']}); /* This content will be displayed in the index.ejs file we´ll create next */
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```

Now we create a simple index.ejs file in our src/views directory:

**index.js**

```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title><%= title %></title>
    </head>
    <body>
      <h1><%= title %></h1>
      <ul>
        <%= for(var i=0; i<list.length; i++) { %>
          <li><%= list[i] %></li>
        <%= } %>
      </ul>
    </body>
  </html>
```

Open http://localhost:8080/ to check the result - EJS should fill out the title and create the unordered list with the items a and b. Now we will take the code from our template index.html code and copy it to index.ejs. EJS will later be used to display a list view of books in our library app.


### 8 Adding a Page Navigation with Routing
___

We want to add two routes to our navigation bar - one for authors and one for books. In the final version of the library app, this will display all books either by their author or book title. We will create those routes in the app.js file and add the navigation to our navbar using EJS.

**app.js**

```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home',
    list: [{Link: '/Books', Text: 'Books'}, /* We change the list from before to a nav element */
    {Link: '/Authors', Text: 'Authors'}]
  });
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```


**index.ejs**

```html
<header>

    <nav class="navbar navbar-inverse navbar-fixed-top" role="banner">
        <div class="container-fluid">

            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a href="/" class="navbar-brand">
                    <%= title %> <!-- Adding nav element from app.js -->
                </a>
            </div>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <% for(var i=0; i<nav.length;i++){%> <!-- Adding nav element from app.js -->
                        <li>
                            <a href="<%=nav[i].Link%>"> <!-- Adding nav element from app.js -->
                                <%= nav[i].Text %> <!-- Adding nav element from app.js -->
                            </a>
                        </li>
                        <%}%>
                </ul>
            </div>
        </div>
    </nav>

</header>
```


### 9 Adding a Router for the Listview of our Book Page
___

#### Adding a Route to Render

We want to group all routes for the Book pages under one Router - later we will simply export this router from a separate file to app.js.

**app.js**

```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000;
var bookRouter = express.Router(); /* Creating a Router for all Book Routes */

app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'ejs');

bookRouter.route('/') /* When you go to /Books you will get the response 'Hello Books' */
    .get(function(req, res) {
      res.send('Hello Books')
    });

bookRouter.route('/Single') /* When you go to /Books/Single you will get the response 'Hello Single Books' */
    .get(function(req, res) {
      res.send('Hello Single Books')
    });

app.use('/Books', bookRouter); /* bookRouter will be used once you go to /Books*/

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home',
    list: [{Link: '/Books', Text: 'Books'},
    {Link: '/Authors', Text: 'Authors'}]
  });
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```

bookRouter now sends us a string 'Hello Books' or 'Hello Single Books' when we go to http://localhost:8080/Books or http://localhost:8080/Books/Single . We now want to render different views when we access those URLs.

**app.js**

```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000;
var bookRouter = express.Router();

app.use(express.static('public'));

app.set('views', './src/views'); /* The render function requires an EJS file here to render */
app.set('view engine', 'ejs');

bookRouter.route('/')
    .get(function(req, res) {
      res.render('bookListView', {  /* We change res.send to res.render. Since we set views to ../src/views, the router will search for a bookListView.ejs in this directory to render */
        title: 'Home', /* We have to add nav since it is displayed on every view - we will export it later */
        list: [{Link: '/Books', Text: 'Books'},
        {Link: '/Authors', Text: 'Authors'}]
      });
    });

bookRouter.route('/Single')
    .get(function(req, res) {
      res.send('Hello Single Books')
    });

app.use('/Books', bookRouter);

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home',
    list: [{Link: '/Books', Text: 'Books'},
    {Link: '/Authors', Text: 'Authors'}]
  });
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```

You can copy the index.ejs file and rename the copy to bookListView.ejs - this file will now be rendered, when you access http://localhost:8080/Books .

#### Adding some Books to the Book View

We now have a view that is rendered when we access the Books view. Now we want to use EJS to populate the view with some books. Later, those books will be added from MongoDB. Now we just hardcode some books into app.js to prove the concept:

**app.js**

```javascript
var express =require('express');

var app = express();

var port = process.env.PORT || 3000;
var bookRouter = express.Router();

app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'ejs');

var books = [{  /* Just some hardcoded books for now - later we will use MongoDB */
    title: 'Cryptonomicon',
    author: 'Neil Stephenson',
    read: true
}, {
    title: 'Leviathan Wakes',
    author: 'James S.A. Corey',
    read: false
}, {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    read: true
}, {
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    read: false
}, {
    title: 'Microserfs',
    author: 'Douglas Coupland',
    read: true
}, {
    title: 'Up Country',
    author: 'Nelson Demille',
    read: true
}, {
    title: 'Night over Water',
    author: 'Ken Follett',
    read: true
}, {
    title: 'The Stand',
    author: 'Stephen King',
    read: true
}];

bookRouter.route('/')
    .get(function(req, res) {
      res.render('bookListView', {
        title: 'Home',
        list: [{Link: '/Books', Text: 'Books'},
        {Link: '/Authors', Text: 'Authors'}]
        books: books /* passing in the book array from above - so it will be available for rendering */
      });
    });

bookRouter.route('/Single')
    .get(function(req, res) {
      res.send('Hello Single Books')
    });

app.use('/Books', bookRouter);

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home',
    list: [{Link: '/Books', Text: 'Books'},
    {Link: '/Authors', Text: 'Authors'}]
  });
});

app.get('/books', function(req, res){
  res.send('Hello World from the books route')
});

app.listen(port, function(err){
  console.log('running server on port' + port);
});
```
Now we can modify our bookListview to add those books via EJS:

**bookListView.ejs**

```html
<section class="container" style="margin-bottom: 400px;">
    <div class="row">
        <% for(var i=0; i<books.length;i++){ %> <!-- Not <%= ...  %> with the EQUAL sign it will not be executed -->
            <div class="col-xs-6 col-md-4 col-lg-3 center-block" style="margin-bottom: 10px;">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4><%= books[i].title %></h4>
                    </div>
                    <div class="panel-body">
                        <div class="col-xs-12 col-sm-4 col-lg-6">
                            <a class="story-title" href="/Books/<%=books[i]._id%>"><img alt="" src="<%=books[i].cover%>" style="height:100px" class="img-thumbnail"></a>
                        </div>
                        <div class="col-xs-12 col-sm-8 col-lg-6">
                            <p><span class="label label-default"><strong><%= books[i].author %></strong></span></p>
                            <p><span style="font-family:courier,'new courier';" class="text-muted"><a href="/Books/<%= i %>" class="text-muted">Read More</a></span></p> <!-- The link to the detailed single book view will be /Books/[i] - we later change this to /Books/:id -->
                        </div>
                    </div>
                </div>
            </div>
            <% } %> <!-- Not <%= } %> with the EQUAL sign it will not be executed -->
    </div>
    <hr>

</section>
```

When you access http://localhost:8080/Books you will see the nav bar from before, as well as a list of our books.


### 10 Cleaning up the App File with Routers
___

Remove routes from the app.js file - We create a file bookRoutes.js under src/routes, cut bookRoutes from app.js and simply require bookRouter instead:

**bookRoutes.js**

```javascript
var express = require('express');

var bookRouter = express.Router();

var books = [
    {
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        },
    {
        title: 'Les Misérables',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        read: false
        },
    {
        title: 'The Time Machine',
        genre: 'Science Fiction',
        author: 'H. G. Wells',
        read: false
        },
    {
        title: 'A Journey into the Center of the Earth',
        genre: 'Science Fiction',
        author: 'Jules Verne',
        read: false
        },
    {
        title: 'The Dark World',
        genre: 'Fantasy',
        author: 'Henry Kuttner',
        read: false
        },
    {
        title: 'The Wind in the Willows',
        genre: 'Fantasy',
        author: 'Kenneth Grahame',
        read: false
        },
    {
        title: 'Life On The Mississippi',
        genre: 'History',
        author: 'Mark Twain',
        read: false
        },
    {
        title: 'Childhood',
        genre: 'Biography',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        }
    ];

    bookRouter.route('/') /* route accessed via /Books - bookListView.ejs will be rendered and populated with title, nav and books */
    .get(function (req, res) {
        res.render('bookListView', {
            title: 'Books',
            nav: [{
                Link: '/Books',
                Text: 'Books'
            }, {
                Link: '/Authors',
                Text: 'Authors'
            }],
            books: books
        });
    });

}
module.exports = bookRouter; /* the bookRouter has to be exported to be available for require in app.js */
```

**app.js**

```javascript
var express = require('express');

var app = express();

var port = process.env.PORT || 5000;

var bookRouter = require('./src/routes/bookRoutes'); /* We now require the book routes that we moved to bookRouter.js*/

app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');


app.use('/Books', bookRouter); /* bookRouter is called here when you access /Books - routes are taken from bookRouter.js */

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Books',
        nav: [{
            Link: '/Books',
            Text: 'Books'
        }, {
            Link: '/Authors',
            Text: 'Authors'
        }]
    });
});

app.get('/books', function (req, res) {
    res.send('Hello Books');
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});
```


### 11 Creating a Single Book by ID Route & View
___

Now we want to add another route to a detailed view of a single books. The Route should be accessible by /Books/:id (ID of the book inside the hardcoded books object - later we will pull an ID from MongoDB). The view rendered will be bookView.ejs.

**bookRoutes.js**

```javascript
var express = require('express');

var bookRouter = express.Router();

var books = [
    {
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        },
    {
        title: 'Les Misérables',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        read: false
        },
    {
        title: 'The Time Machine',
        genre: 'Science Fiction',
        author: 'H. G. Wells',
        read: false
        },
    {
        title: 'A Journey into the Center of the Earth',
        genre: 'Science Fiction',
        author: 'Jules Verne',
        read: false
        },
    {
        title: 'The Dark World',
        genre: 'Fantasy',
        author: 'Henry Kuttner',
        read: false
        },
    {
        title: 'The Wind in the Willows',
        genre: 'Fantasy',
        author: 'Kenneth Grahame',
        read: false
        },
    {
        title: 'Life On The Mississippi',
        genre: 'History',
        author: 'Mark Twain',
        read: false
        },
    {
        title: 'Childhood',
        genre: 'Biography',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        }
];


bookRouter.route('/')
    .get(function (req, res) {
        res.render('bookListView', {
            title: 'Books',
            nav: [{
                Link: '/Books',
                Text: 'Books'
            }, {
                Link: '/Authors',
                Text: 'Authors'
            }]
        });
    });

    bookRouter.route('/:id')  /* We want to be able to access detailed info about a single book by adding the book ID - /Books/:id */
    .get(function (req, res) {
        var id = req.params.id; /* pass id parameter into URL - will be retrieved from books[id] */
        res.render('bookView', {  /* We have to create another view for the single book - bookView.ejs */
            title: 'Books',
            nav: [{
                Link: '/Books',
                Text: 'Books'
            }, {
                Link: '/Authors',
                Text: 'Authors'
            }]
            book: books[id]
        });
    });

}
module.exports = bookRouter;
```

Now we need to write the view to be rendered bookView.ejs (the code below only contains the body part - the header is identical to bookListView.ejs):

**bookView.ejs**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Library App</title>
  </head>
  <body>
    <section class="container" style="margin-bottom: 300px;">
        <div class="row">
            <div class="col-xs-12 center-block">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4><%= book.title %></h4>
                    </div>
                    <div class="panel-body">
                        <div class="col-xs-12 col-sm-2 col-lg-1">
                            <a class="story-title"><img alt="Book Cover" src="<%=book.book.image_url%>" class="img-responsive"></a>
                        </div>
                        <div class="col-xs-12 col-sm-10 col-lg-11">
                            <h4><span class="label label-default"><strong><%= book.author %></strong></span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

  </body>
</html>
```


### 12 Cleaning up our routes by creating a variable for the NAV element
___

We created a navbar in all our views and used EJS to inject some navigational elements in there. But we don´t want to have to copy it into every route. We will create a nav element in app.js instead.

**app.js**

```javascript
var express = require('express');

var app = express();

var port = process.env.PORT || 5000;
var nav = [{                           /* We create a NAV element in app.js - this is now available for all routes */
    Link: '/Books',
    Text: 'Book'
    }, {
    Link: '/Authors',
    Text: 'Author'
    }];
var bookRouter = require('./src/routes/bookRoutes')(nav); /* The NAV element is now automatically passed into bookRouter to be available on all bookRoutes */

app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');


app.use('/Books', bookRouter);

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Home',
        nav: nav     /* We no longer have to type in the whole navigation - YEAH!*/
    });
});

app.get('/books', function (req, res) {
    res.send('Hello Books');
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});
```

**bookRoutes.js**

Now we have to wrap our routes into a router function with NAV as a variable, to make it available to those routes:

```javascript
var express = require('express');

var bookRouter = express.Router();

var router = function(nav){ /* The router is wrapped into a function with NAV as a variable */
    var books = [
    {
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        },
    {
        title: 'Les Misérables',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        read: false
        },
    {
        title: 'The Time Machine',
        genre: 'Science Fiction',
        author: 'H. G. Wells',
        read: false
        },
    {
        title: 'A Journey into the Center of the Earth',
        genre: 'Science Fiction',
        author: 'Jules Verne',
        read: false
        },
    {
        title: 'The Dark World',
        genre: 'Fantasy',
        author: 'Henry Kuttner',
        read: false
        },
    {
        title: 'The Wind in the Willows',
        genre: 'Fantasy',
        author: 'Kenneth Grahame',
        read: false
        },
    {
        title: 'Life On The Mississippi',
        genre: 'History',
        author: 'Mark Twain',
        read: false
        },
    {
        title: 'Childhood',
        genre: 'Biography',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
        }
    ];
    bookRouter.route('/')
    .get(function (req, res) {
        res.render('bookListView', {
            title: 'Books',
            nav: nav,         /* All routes wrapped into router function can now use NAV as a variable */
            books: books
        });
    });

    bookRouter.route('/:id')
    .get(function (req, res) {
        var id = req.params.id;
        res.render('bookView', {
            title: 'Books',
            nav: nav, /* All routes wrapped into router function can now use NAV as a variable */
            book: books[id]
        });
    });

    return bookRouter; /* bookRouter has now to be returned from our router function */
}
module.exports = router;  /* We now have to export the router instead of bookRouter - the router function will be executed in app.js with the NAV element to create a router */
```


### 13 Adding MongoDB
___

#### Download and Install MongoDB

The installer can be downloaded from [MongoDB.org](https://www.mongodb.com/download-center?jmp=nav#community)

Install the database, navigate to the install directory (e.g. *C:\Program Files\MongoDB\Server\3.2\bin*) with your command line and start the application with the command ***mongod***. Make sure that you created a directory *C:\data\db* before running the mongod process!

Useful Commands for MongoDB:

Command | Function
--- | ---
***mongo*** | Start
***show dbs*** | Display all Databases
***mongo libraryApp*** | Open libraryApp Database
***show collections*** | Show all Collections of the opened Databases
***db.books.find();*** | Display all Objects inside the books Collection
***db.books.remove({})*** | Remove all Objects from the books Collection


#### Create adminRoutes to populate the Database

First install mongoDB into our project with *npm install --save mongodb*

**adminRoutes.js**

Now we create a new file adminRoutes.js in the *src/routes* directory.

```javascript
var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient; /* Pull in the mongoClient */

var books = [{ /* Copy books from bookRoutes.js */
    title: 'Cryptonomicon',
    isbn10: '0060512806',
    author: 'Neil Stephenson',
    bookId: '816',
    cover: 'http://ecx.images-amazon.com/images/I/414L%2BIbzcvL._SX317_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Leviathan Wakes',
    isbn10: '0316129089',
    author: 'James S.A. Corey',
    bookId: '9533361',
    cover: 'http://ecx.images-amazon.com/images/I/51QvTzb2vYL._SX322_BO1,204,203,200_.jpg',
    read: false
}, {
    title: 'The Lord of the Rings',
    isbn10: '0395193958',
    author: 'J.R.R. Tolkien',
    bookId: '569465',
    cover: 'http://ecx.images-amazon.com/images/I/51eq24cRtRL._SX331_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Norwegian Wood',
    isbn10: '0375704027',
    author: 'Haruki Murakami',
    bookId: '11297',
    cover: 'http://ecx.images-amazon.com/images/I/512ZgaaHjIL._SX322_BO1,204,203,200_.jpg',
    read: false
}, {
    title: 'Microserfs',
    isbn10: '0006548598',
    author: 'Douglas Coupland',
    bookId: '2751',
    cover: 'http://ecx.images-amazon.com/images/I/512ZD5DVC4L._SX345_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Up Country',
    isbn10: '0446611913',
    author: 'Nelson Demille',
    bookId: '33820',
    cover: 'http://ecx.images-amazon.com/images/I/512Jrk-RopL._SX290_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Night over Water',
    isbn10: '0451173139',
    author: 'Ken Follett',
    bookId: '967690',
    cover: 'http://ecx.images-amazon.com/images/I/51OON2-%2BI-L._SX297_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'The Stand',
    isbn10: '0307947300',
    author: 'Stephen King',
    bookId: '13155183',
    cover: 'http://ecx.images-amazon.com/images/I/41IzCMjxPWL._SX320_BO1,204,203,200_.jpg',
    read: true
}];

var router = function (nav) {

    adminRouter.route('/addBooks') /* open http://localhost:8080/Admin/addBooks to add books to MongoDB */
        .get(function (req, res) {
            var url =
                'mongodb://localhost:27017/libraryApp'; /* Connect to our local installation of MongoDB via the default port 27017 - create DB libraryApp on insert */

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books'); /* Connect to a Collection in libraryApp named books - is created on first insert */
                collection.insertMany(books, /* insertMany inserts all Objects from the books variable from above (otherwise insertOne) */
                    function (err, results) {
                        res.send(results); /* Display the Collection after Insert - Object will be assigned ID by MongoDB*/
                        db.close(); /* db.close has to be inside the callback (async !)*/
                    }
                );

            });

        });

    return adminRouter;
};

module.exports = router;
```


**app.js**

Add the /Admin route to App.js and use adminRouter for it

```javascript
var express = require('express');

var app = express();

var port = process.env.PORT || 5000;
var nav = [{
    Link: '/Books',
    Text: 'Book'
}, {
    Link: '/Authors',
    Text: 'Author'
}];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav); /* Add adminRoutes */

app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');

app.use('/Books', bookRouter);
app.use('/Admin', adminRouter); /* Use adminRoutes for /Admin */

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello from render',
        nav: [{
            Link: '/Books',
            Text: 'Books'
        }, {
            Link: '/Authors',
            Text: 'Authors'
        }]
    });
});

app.get('/books', function (req, res) {
    res.send('Hello Books');
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});
```

Now make sure mongod is running and access http://localhost:8080/Admin/addBooks - you will get a JSON Object as MongoDB Response. All books will have an ID assigned by the Database and the DB 'libraryApp' and Collection 'books' will be created. Use the mongo commands (List, above) to check.


### 14 Use the MongoDB Response
___

#### Select Many

**bookRoutes.js**

Remove the hardcoded books variable and use the mongoDB response instead. Display all books from the books Collection. (bookListView.ejs)

```javascript
var express = require('express');
var bookRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function (nav) {

 /* var books = [...]; has been deleted */

    bookRouter.route('/')
        .get(function (req, res) {
            var url =
                'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books'); /* Connect to mongoDBs libraryApp books Collection */

                collection.find({}).toArray( /* find all Objects in the books Collection and put it into an Array */
                    function (err, results) {
                        res.render('bookListView', { /* Copy the res.render from before into the function to render the result of our mongoDB query*/
                            title: 'Books',
                            nav: nav,
                            books: results
                        });
                    }
                );
            });

        });

    return bookRouter;
};
module.exports = router;
```


#### Select One

**bookRoutes.js**

Now we want to have a books details page (bookView.ejs) that only displays one book from the books Collection

```javascript
var express = require('express');
var bookRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID; /* Each book is assigned an ID by mongoDB - we make this ID available for our bookListView.ejs */

var router = function (nav) {

    bookRouter.route('/')
        .get(function (req, res) {
            var url =
                'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');

                collection.find({}).toArray(
                    function (err, results) {
                        res.render('bookListView', {
                            title: 'Books',
                            nav: nav,
                            books: results
                        });
                    }
                );
            });

        });

    bookRouter.route('/:id')
        .get(function (req, res) {
            var id = new objectId(req.params.id); /* We use the mongoDB ID (_id) for id -> URL is now /Books/:_id instead of /Books/:id */
            var url =
                'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');

                collection.findOne({_id: id}, /* findOne returns the first book from the books collection with the same _id */
                    function (err, results) {
                        res.render('bookView', { /* result will be rendered in bookView.ejs */
                            title: 'Books',
                            nav: nav,
                            book: results
                        });

                    }
                );

            });

        });

    return bookRouter;
};
module.exports = router;
```

**bookListView.ejs**

Now we want to have a books details page (bookView.ejs) that only displays one book from the books Collection

```html
...
<!-- ################################################ Media ######################################################### -->

<section class="container" style="margin-bottom: 400px;">
    <div class="row">
        <% for(var i=0; i<books.length;i++){%>
            <div class="col-xs-6 col-md-4 col-lg-3 center-block" style="margin-bottom: 10px;">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4><%=books[i].title%></h4>
                    </div>
                    <div class="panel-body">
                        <div class="col-xs-12 col-sm-4 col-lg-6">
                            <a class="story-title" href="/Books/<%=books[i]._id%>"><img alt="" src="<%=books[i].cover%>" style="height:100px" class="img-thumbnail"></a>
                        </div>
                        <div class="col-xs-12 col-sm-8 col-lg-6">
                            <p><span class="label label-default"><strong><%=books[i].author%></strong></span></p>
                            <p><span style="font-family:courier,'new courier';" class="text-muted"><a href="/Books/<%=books[i]._id%>" class="text-muted">Read More</a></span></p> <!-- Change URL from /Books/:i (<%= i %> with i = 0,1,2,3....8) to /Books/:_id -> _id will be used to findOne -->
                        </div>
                    </div>
                </div>
            </div>
            <%}%>
    </div>
    <hr>

</section>
...
```


### 15 Creating a SignIn Form on Index.ejs
___

**index.ejs**

Just a simple Input Form

```html
...
<!-- ################################################ Login ######################################################### -->

<div class="col-xs-4 col-xs-offset-1" style="margin-top: 30px;">
    <div class="container">
        <div class="row">
            <div class="col-sm-offset-1 col-sm-2 col-xs-12 text-center">
                <form name="signUpForm" action="/auth/signUp" method="post"> <!-- Creating a form to post SignUp to /auth/signUp -->
                    User Name:
                    <input name="userName" id="userName"> <!-- Input userName for post -->
                    <br/>
                    <br/>
                    Password:
                    <input name="password" id="password"> <!-- Input password for post -->
                    <br/>
                    <br/>
                    <input type="submit" value="Sign Up"> <!-- Submit post -->
                </form>
            </div>
        </div> <!-- /row -->
    </div> <!-- /container -->
</div> <!-- /v-center -->

<!-- ################################################ /Login ######################################################### -->
...
```


### 16 Creating the Authentication Route
___

**authRoute.js**

We need to add *var bodyParser = require('body-parser');* to **app.js**. The body-parser middleware will be used in *app.use(bodyParser.json());* and
*app.use(bodyParser.urlencoded());* to create a req.body object from JSON elements or URL parameter. Body-parser is install with *npm install --save body-parser*.

```javascript
var express = require('express');
var authRouter = express.Router(); /* Creating the Authentication Router */
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function () {
    authRouter.route('/signUp') /* Creating the SingUp route */
        .post(function (req, res) {
            console.log(req.body); /* We log the req.body Object created by bodyParser from the signUp post to /auth/signup */
                });

            };

    return authRouter; /* return authRouter to be available for app.js */
};

module.exports = router;

```

**app.js**

We now add the authRoute to app.js

```javascript
var express = require('express');
var bodyParser = require('body-parser');  /* Install bodyParser see above */

var app = express();

var port = process.env.PORT || 5000;
var nav = [{
    Link: '/Books',
    Text: 'Book'
}, {
    Link: '/Authors',
    Text: 'Author'
}];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);
var authRouter = require('./src/routes/authRoutes')(nav); /* Use the created authRouter for the Authentication routes */

app.use(express.static('public'));
app.use(bodyParser.json()); /* Use bodyParser to create req.body Object from JSON elements*/
app.use(bodyParser.urlencoded()); /* Use bodyParser to create req.body Object from URL encoded JSON elements*/

require('./src/config/passport')(app);

app.set('views', './src/views');

app.set('view engine', 'ejs');

app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter); /* Use the created authRouter for the Authentication routes */

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello from render',
        nav: [{
            Link: '/Books',
            Text: 'Books'
        }, {
            Link: '/Authors',
            Text: 'Authors'
        }]
    });
});

app.get('/books', function (req, res) {
    res.send('Hello Books');
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});
```


### 17 Adding Passport.js Middleware
___

**authRoute.js**

First we need to *npm install --save cookie-parser passport express-session*.

```javascript
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); /* To parse the session cookie used by passport */
var passport = require('passport'); /* user authentication */
var session = require('express-session'); /* for passport-session: creates a session for the logged in user. Session stores the user information inside a cookie for the active session */

var app = express();

var port = process.env.PORT || 5000;
var nav = [{
    Link: '/Books',
    Text: 'Book'
}, {
    Link: '/Authors',
    Text: 'Author'
}];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);
var authRouter = require('./src/routes/authRoutes')(nav);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser()); /* use cookieParser to parse the session cookie */
app.use(session({secret: 'library'})); /* The session needs a secret - can be chosen freely */

require('./src/config/passport')(app); /* We separate the passport stuff src/config/passport.js - we pull in (app) to be able to app.use inside passport.js */

app.set('views', './src/views');

app.set('view engine', 'ejs');

app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello from render',
        nav: [{
            Link: '/Books',
            Text: 'Books'
        }, {
            Link: '/Authors',
            Text: 'Authors'
        }]
    });
});

app.get('/books', function (req, res) {
    res.send('Hello Books');
});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});
```

**passport.js**

Separate the passport component to src/config/passport.js. We need to *npm install --save passport-local* to use the local strategy of authentication (not OAuth).

```javascript
var passport = require('passport'); /* pull in passport */

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) { /* Add User to Session */
        done(null, user); /* Callback User from Database */
    });

    passport.deserializeUser(function (user, done) { /* Remove User from Session */
        done(null, user);
    });

    require('./strategies/local.strategy')(); /* We only use a local.strategy for authentication - not passport.google, passport.facebook, etc. - Third-party OAuth. We save the file in src/config/strategies/local.strategy.js */

};
```


### 18 Authentication with Local Strategy
___

**local.strategy.js**

Now we create the local.strategy.js as required in passport.js

```javascript
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongodb = require('mongodb').MongoClient;

module.exports = function () {
    passport.use(new LocalStrategy({
          usernameField: 'userName', /* take userName from input form in index.ejs when posted to /auth/signUp (bodyParser) */
          passwordField: 'password' /* take password from input form in index.ejs when posted to /auth/signUp (bodyParser) */
      },
      function (username, password, done) { /* Pass username/password - then callBack done */
          var user = {username: username,
                      password: password
                    };
                    done(null, user); /* Take user and return user - authentication with mongoDB comes next */
                  }));
};
```

**authRoute.js**

req.login and redirect to Profile

```javascript
var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function () {
    authRouter.route('/signUp')
        .post(function (req, res) {
            console.log(req.body);
            req.login(req.body, function(){ /* We do not yet save the user to mongoDB - just redirect him to /auth/profile */
              res.redirect('/auth/profile');
            });
        });
    authRouter.route('/profile') /* we have to create the profile route */
      .get(function(req, res) { /* When GET /profile... */
        res.json(req.user); /* ... respond with the JSON Object user */
      });
    return authRouter;
};

module.exports = router;
```


### 19 Saving the User to MongoDB
___

**authRoute.js**

SignUp save User to MongoDB

```javascript
var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function () {
    authRouter.route('/signUp')
        .post(function (req, res) {
            console.log(req.body);
            var url =
                'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) { /* connect to local install of mongoDB */
                var collection = db.collection('users'); /* open users collection that is created on first signUp */
                var user = { /* Creation of a user object from req.body */
                    username: req.body.userName,
                    password: req.body.password
                };

                collection.insert(user, /* the user is automatically inserted into the users collection (collection is automatically created) */
                    function (err, results) {
                        req.login(results.ops[0], function () { /* user is no longer taken from req.body but from the results ops[0] limits the result to the {username, password, _id} JSON object */
                            res.redirect('/auth/profile');
                        });
                    });
            });

        });
    authRouter.route('/profile')
      .get(function(req, res) {
        res.json(req.user);
      });
    return authRouter;
};

module.exports = router;
```


### 20 User SignIn from mongoDB
___

**index.ejs**

Creating the SignIn Form

```html
<!-- ################################################ Login ######################################################### -->

<div class="col-xs-4 col-xs-offset-1" style="margin-top: 30px;">
    <div class="container">
        <div class="row">
            <div class="col-sm-offset-3 col-sm-2 col-xs-12 text-center">
                <form name="signInForm" action="/auth/signIn" method="post"> <!-- SignIN -->
                    User Name:
                    <input name="userName" id="userName">
                    <br/>
                    <br/>
                    Password:
                    <input name="password" id="password">
                    <br/>
                    <br/>
                    <input type="submit" value="Sign In">
                </form>
            </div>

            <div class="clearfix visible-xs" style="margin-bottom: 20px;"></div>

            <div class="col-sm-offset-1 col-sm-2 col-xs-12 text-center">
                <form name="signUpForm" action="/auth/signUp" method="post"> <!-- SignUp -->
                    User Name:
                    <input name="userName" id="userName">
                    <br/>
                    <br/>
                    Password:
                    <input name="password" id="password">
                    <br/>
                    <br/>
                    <input type="submit" value="Sign Up">
                </form>
            </div>
        </div> <!-- /row -->
    </div> <!-- /container -->
</div> <!-- /v-center -->
<!-- ################################################ /Login ######################################################### -->

```

**authRoute.js**

SignIn save User to MongoDB

```javascript
var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport'); /* Pull in passport for signIn */

var router = function () {
    authRouter.route('/signUp')
        .post(function (req, res) {
            console.log(req.body);
            var url =
                'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                var user = {
                    username: req.body.userName,
                    password: req.body.password
                };

                collection.insert(user,
                    function (err, results) {
                        req.login(results.ops[0], function () {
                            res.redirect('/auth/profile');
                        });
                    });
            });

        });
    authRouter.route('/signIn')
        .post(passport.authenticate('local', { /* user post is authenticated with passport local strategy */
            failureRedirect: '/' /* If user did not sign up first - redirect back to home */
        }), function (req, res) {
            res.redirect('/auth/profile'); /* If successfully authenticated go to profile page */
        });
    authRouter.route('/profile')
        .all(function (req, res, next) {
            if (!req.user) {
                res.redirect('/');
            }
            next();
        })
        .get(function (req, res) {
            res.json(req.user);
        });
    return authRouter;
};

module.exports = router;
```


### 21 Verifying User in DB
___

**authRoute.js**

Verification

```javascript

´´´
