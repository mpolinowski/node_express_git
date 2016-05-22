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
8. [Adding a Page Navigation with Routing](#7-adding-a-page-navigation-with-routing)


### 1 Install Node.js and Express.js to serve our Web Application

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

First install Bower globally with *npm install bower -g*. Then do a *bower init* to the app directory (creation of **bower.json**).

We now add a new file to tell Bower to install directly into our public directory:

**.bowerrc**


```javascript
"directory": "public/lib"
```

Next we *bower install bootstrap font-awesome --save* to get the latest stable version of the framework (add *bower_components* bootstrap + jquery). They will be installed to the lib directory in our public folder. The bootstrap/jquery/font-awesome files can now be added to the template index.html by linking e.g. *<link href="lib/dist/css/bootstrap.min.css" rel="stylesheet">*.


### 6 Add Gulp to the Project

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


### 7 Adding a Page Navigation with Routing
