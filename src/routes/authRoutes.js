var express = require('express');

var authRouter = express.Router();

var router = function(nav) {
    var authors = [{
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
    }, {
        title: 'Les Misérables',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        read: false
    }, {
        title: 'The Time Machine',
        genre: 'Science Fiction',
        author: 'H. G. Wells',
        read: false
    }, {
        title: 'A Journey into the Center of the Earth',
        genre: 'Science Fiction',
        author: 'Jules Verne',
        read: false
    }, {
        title: 'The Dark World',
        genre: 'Fantasy',
        author: 'Henry Kuttner',
        read: false
    }, {
        title: 'The Wind in the Willows',
        genre: 'Fantasy',
        author: 'Kenneth Grahame',
        read: false
    }, {
        title: 'Life On The Mississippi',
        genre: 'History',
        author: 'Mark Twain',
        read: false
    }, {
        title: 'Childhood',
        genre: 'Biography',
        author: 'Lev Nikolayevich Tolstoy',
        read: false
    }];

    authRouter.route('/')
        .get(function(req, res) {
            res.render('authListView', {
                title: 'Authors',
                nav: nav,
                authors: authors
            });
        });

    authRouter.route('/:id')
        .get(function(req, res) {
            var id = req.params.id
            res.render('authView', {
                title: 'Author Details',
                nav: nav,
                author: authors[id]
            });
        });

    return authRouter;

}

module.exports = router;