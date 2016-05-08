var express = require('express');
var authorRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var router = function (nav) {
    var authorController = require('../controllers/authorController')(null, nav);
    authorRouter.use(authorController.middleware);

    authorRouter.route('/')
        .get(authorController.getIndex);

    authorRouter.route('/:id')
        .get(authorController.getById);

    return authorRouter;

};

module.exports = router;
