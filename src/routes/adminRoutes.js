var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var books = [{
    title: 'Cryptonomicon',
    isbn10: '0060512806',
    author: 'Neil Stephenson',
    cover: 'http://ecx.images-amazon.com/images/I/414L%2BIbzcvL.jpg',
    read: true
}, {
    title: 'Leviathan Wakes',
    isbn10: '0316129089',
    author: 'James S.A. Corey',
    cover: 'http://ecx.images-amazon.com/images/I/91npjUXXkzL.jpg',
    read: false
}, {
    title: 'The Lord of the Rings',
    isbn10: '0395193958',
    author: 'J.R.R. Tolkien',
    cover: 'http://ecx.images-amazon.com/images/I/51eq24cRtRL.jpg',
    read: true
}, {
    title: 'Norwegian Wood',
    isbn10: '0375704027',
    author: 'Haruki Murakami',
    cover: 'http://ecx.images-amazon.com/images/I/512ZgaaHjIL.jpg',
    read: false
}, {
    title: 'Microserfs',
    isbn10: '0006548598',
    author: 'Douglas Coupland',
    cover: 'http://ecx.images-amazon.com/images/I/512ZD5DVC4L.jpg',
    read: true
}, {
    title: 'Up Country',
    isbn10: '0446611913',
    author: 'Nelson Demille',
    cover: 'http://ecx.images-amazon.com/images/I/61NzLcKzBrL.jpg',
    read: true
}, {
    title: 'Night over Water',
    isbn10: '0451173139',
    author: 'Ken Follett',
    cover: 'http://ecx.images-amazon.com/images/I/81iMLxBf9DL.jpg',
    read: true
}, {
    title: 'The Stand',
    isbn10: '0307947300',
    author: 'Stephen King',
    cover: 'http://ecx.images-amazon.com/images/I/41IzCMjxPWL.jpg',
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
