var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var books = [{
    title: 'Cryptonomicon',
    isbn10: '0060512806',
    author: 'Neil Stephenson',
    read: true
}, {
    title: 'Leviathan Wakes',
    isbn10: '0316129089',
    author: 'James S.A. Corey',
    read: false
}, {
    title: 'The Lord of the Rings',
    isbn10: '0395193958',
    author: 'J.R.R. Tolkien',
    read: true
}, {
    title: 'Norwegian Wood',
    genre: 'Science Fiction',
    isbn10: '0375704027',
    author: 'Haruki Murakami',
    read: false
}, {
    title: 'Microserfs',
    isbn10: '0006548598',
    author: 'Douglas Coupland',
    read: true
}, {
    title: 'Upcountry',
    isbn10: '0446611913',
    author: 'Nelson Demille',
    read: true
}, {
    title: 'Night over Water',
    isbn10: '0451173139',
    author: 'Ken Follett',
    read: true
}, {
    title: 'The Stand',
    isbn10: '0307947300',
    author: 'Stephen King',
    read: true
}];

var router = function(nav) {

    adminRouter.route('/addBooks')
        .get(function(req, res) {
            var url = 'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function(err, db) {
                var collection = db.collection('books');
                collection.insertMany(books, function(err, results) {
                    res.send(results);
                    db.close();
                });
            });

        });

    return adminRouter;
};

module.exports = router;
