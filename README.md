#A Node/Express Library App with MongoDB (Training)

 This code is part of a training in web development with **Node.js**. **EJS** will be used as template engine for rendering HTML out of **Express**. The library application will use **MongoDB** to store information about books and authors - but will also employ the [GoodReads API](https://www.goodreads.com/api) to provide more details on each. **Passport.js** is used for local security.

This App was created in several steps:

1. [Install Node.js and Express.js to serve our Web Application](#1-install-nodejs-and-expressjs-to-serve-our-web-application)
2. [Add Start Script](#2-add-start-script)
3. [Add Routing (Hello World)](#3-add-routing-hello-world)
4. [Serve Static Files](#4-serve-static-files)
5. [Add Bower to the Project](#5-add-bower-to-the-project)
6. [Add Gulp to the Project](#6-add-gulp-to-the-project)



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

Through the public route, we are now able to access the css/js files by typing in e.g. http://localhost:3000/css/styles.css into our browser (the bootstrap components of the template will not be used - we Bower to add them later). The index.html is accessible by http://localhost:3000/index.html.


### 5 Add Bower to the Project

First install Bower globally with *npm install bower -g*. Then do a *bower init* to the app directory (creation of **bower.json**).

We now add a new file to tell Bower to install directly into our public directory:

**.bowerrc**


```javascript
"directory": "public/lib"
```

Next we *bower install bootstrap font-awesome --save* to get the latest stable version of the framework (add *bower_components* bootstrap + jquery). They will be installed to the lib directory in our public folder. The bootstrap/jquery/font-awesome files can now be added to the template index.html by linking e.g. *<link href="lib/dist/css/bootstrap.min.css" rel="stylesheet">*.


### 6 Add Gulp to the Project (Wiredep)

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

We now have to add <!--bower:css-->, <!--bower:js-->, <!--inject:css--> and  <!--inject:js--> to our index.html template to inject the css/js dependencies, when the command *gulp inject* is run.

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
