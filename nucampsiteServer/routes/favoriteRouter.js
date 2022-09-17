const express = require('express'); 
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const { populate } = require('../models/user');

const favoriteRouter = express.Router(); 


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
    populate(user)
    populate(campsites)
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            req.body.forEach(favorite => {
                if(!favorite.campsites.includes(favorite._id)) {
                    favorite.campsites.push(favorite._id);
                }
            });
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            Favorite.create({ user: req.user._id }).then(favorite => {
                req.body.forEach(fav => {
                    if(!favorite.campsites.includes(favorite._id)) {
                        favorite.campsites.push(favorite._id);
                    }
                });
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            })
                .catch(err => next(err));
        }
    })
  })

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('Nope!');
  })

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        if(favorite)
      {res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    } else{
       
        res.setHeader('Content-Type', 'text/plain')
        res.end('You have no favorites to delete')
    }
    })
    .catch(err => next(err));

})


favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`Not supported`);

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId);
                favorite.save()
                  .then((favorite) => {
                      console.log('Added to your list of favorites!', favorite);
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(favorite);
                  })
                  .catch(err => next(err));
            } else {
                res.setHeader('Content-Type', 'text/plain');
                res.end('That campsite was already marked as a favorite!');
            } 
          }else {
                Favorite.create({
                    user: req.user._id,
                    campsites: [req.params.campsiteId],
                })
                  .then((favorite) => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json(favorite);
                  })
                  .catch(err => next(err));
            }
    })
    .catch(err => next(err));

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {

    res.statusCode = 403;
    res.end(
        `Not supported`
    );

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
        if (favorite) {
            favorite.campsites.splice(favorite.campsites.indexOf(req.params.campsiteId), 1);
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('There are no campsites to delete');
        }
    });


})
module.exports = favoriteRouter; 