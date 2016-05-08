var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var authorController = function(authorService, nav) {
    var middleware = function(req, res, next) {
        if (!req.user) {
            res.redirect('/');
        }
        next();
    };
    var getIndex = function(req, res) {
        var url =
            'mongodb://localhost:27017/libraryApp';

        mongodb.connect(url, function(err, db) {
            var collection = db.collection('books');

            collection.find({}).toArray(
                function(err, results) {
                    res.render('authorListView', {
                        title: 'Back Home',
                        nav: nav,
                        authors: results
                    });
                }
            );
        });
    };

    var getById = function(req, res) {
        var id = new objectId(req.params.id);
        var url =
            'mongodb://localhost:27017/libraryApp';

        mongodb.connect(url, function(err, db) {
            var collection = db.collection('books');

            collection.findOne({
                    _id: id
                },
                function(err, results) {
                    res.render('authorView', {
                        title: 'Back Home',
                        nav: nav,
                        authors: results
                    });
                }
            );
        });
    };

    return {
        getIndex: getIndex,
        getById: getById,
        middleware: middleware
    };
};

module.exports = authorController;
