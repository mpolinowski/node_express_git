# node_express_git
##A Node/Express Library App with MongoDB (Training)

 This code is part of a training in web development with **Node.js**. **EJS** will be used as template engine for rendering HTML out of **Express**. The library application will use **MongoDB** to store information about books and authors - but will also employ the [GoodReads API] (https://www.goodreads.com/api) to provide more details on each. **Passport.js** is used for local security.

This App was created in several steps:


### Install Node.js and Express.js to serve our web application

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




### Add Start Script

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
