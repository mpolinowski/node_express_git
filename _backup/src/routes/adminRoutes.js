var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var books = [{
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
