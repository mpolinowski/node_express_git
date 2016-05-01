var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

var nav = [{
    Link: '/Books',
    Text: 'Book'
}, {
    Link: '/Authors',
    Text: 'Author'
}];

var bookRouter = require('./src/routes/bookRoutes')(nav);
var authRouter = require('./src/routes/authRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);

app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');

app.use('/Books', bookRouter);
app.use('/Authors', authRouter);
app.use('/Admin', adminRouter);

app.get('/', function(req, res) {
    res.render('index', {
        title: 'HOME',
        nav: nav
    });
});

app.listen(port, function(err) {
    console.log('running server on port ' + port);
});