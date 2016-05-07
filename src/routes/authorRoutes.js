var express = require('express');
var authorRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var router = function (nav) {

    authorRouter.route('/')
        .get(function (req, res) {
            var url =
                'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');

                collection.find({}).toArray(
                    function (err, results) {
                        res.render('authorListView', {
                            title: 'Back Home',
                            nav: nav,
                            authors: results
                        });
                    }
                );
            });

        });

    authorRouter.route('/:id')
        .get(function (req, res) {
            var id = new objectId(req.params.id);
            var url =
                'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');

                collection.findOne({_id: id},
                    function (err, results) {
                        res.render('authorView', {
                            title: 'Back Home',
                            nav: nav,
                            authors: results
                        });

                    }
                );

            });

        });

    return authorRouter;

};

module.exports = router;
