var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function () {
    authRouter.route('/signUp')
        .post(function (req, res) {
            console.log(req.body);
            var url = 'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function(err, db) {
                var collection = db.collection('users');
                var user = {
                    username: req.body.userName,
                    password: req.body.password
                };

                collection.insert(user, function (err, results) {
                    req.login(results.ops[0], function() {
                        //res.redirect('/auth/profile');  /* Use this for debugging or create a profile page */
                        res.redirect('/'); /* After user insertion return home instead of going to profile */
                    });
                });

            });
        });
    authRouter.route('/signIn')
        .post(passport.authenticate('local', {
        failureRedirect: '/'
    }), function(req, res) {
        res.redirect('/auth/profile');
        //res.redirect('/Books');
    });
    authRouter.route('/profile')
        .all(function (req, res, next) {
            if (req.user) {
                res.redirect('/Books'); /* After successful signIn go to /Books */
            }
            next();
        })
        .get(function(req, res) {
            res.json(req.user);
        });
    return authRouter;
};

module.exports = router;
