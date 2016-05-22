# node_express_git
##A Node/Express Library App with MongoDB (Training)

 This code is part of a training in web development with **Node.js**. **EJS** will be used as template engine for rendering HTML out of **Express**. The library application will use **MongoDB** to store information about books and authors - but will also employ the [GoodReads API] (https://www.goodreads.com/api) to provide more details on each. **Passport.js** is used for local security.

This App was created in several steps:


### 1 Install Node.js and Express.js to serve our web application

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

```javascript

{
  "name": "node-express",
  "version": "1.0.0",
  "description": "Library App",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js"
  },
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


### 4 Serve static files

**app.js**

We first add to new folders to our project - **public/css & public/js** and a **src/views** folder. We download a free Bootstrap theme from a page like bootstrapzero.com and put the css/js files into the public folder. The html file has to be located in the views folder. The Express middleware is used to serve the content of our public folder, by adding the line *app.use(express.static('public'));* to the app.js file. The static html file - index.html - from our template, will be served by *app.use(express.static('src/views'));*.

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

Through the public route, we are now able to access the css/js files by typing in e.g. http://localhost:3000/css/styles.css into our browser. The index.html is accessible by http://localhost:3000/index.html.


### 5 Add Bower to the project

**app.js**

We first add to new folders to our project - **public/css & public/js** and a **src/views** folder. We download a free Bootstrap theme from a page like bootstrapzero.com and put the css/js files into the public folder. The html file has to be located in the views folder. The Express middleware is used to serve the content of our public folder, by adding the line *app.use(express.static('public'));* to the app.js file. The static html file - index.html - from our template, will be served by *app.use(express.static('src/views'));*.

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

Through the public route, we are now able to access the css/js files by typing in e.g. http://localhost:3000/css/styles.css into our browser. The index.html is accessible by http://localhost:3000/index.html.
