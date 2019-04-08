const express = require('express');
const models = require('../models');
const passport = require('../middlewares/auth');

const router = express.Router();
const User = models.Users;

const AUTH_CONTROLLER = {
  registerRoute() {
    router.get('/error', this.error);
    router.get('/unauthorized', this.unauthorized);
    router.get('/logout', this.logout);
    router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/unauthorized' }), this.login);
    router.post('/signup', this.signup);
    return router;
  },

  error(req, res) {
    res.sendStatus(401);
  },

  unauthorized(req, res) {
    res.status(401).json({ message: req.flash('error') });
  },

  /*
    authenticate(){
        return (passport.authenticate('local', {failureFlash: true, failureRedirect: '/auth/unauthorized'}) );
    }, */

  login(req, res) {
    res.json({
      user_id: req.user.user_id,
      email: req.user.email,
      username: req.user.username,
      food_restrictions: req.user.food_restrictions,
    });
  },

  signup(req, res) {
    if (req.body.email === undefined || req.body.username === undefined || req.body.password === undefined) {
      res.status(400).json({ message: 'Inputs are invalid! Please make sure all information are completed correctly. ' });
    } else {
      const { email } = req.body;
      User.findOne({ where: { email } })
        .then((user) => {
          if (user) {
            res.json({ message: 'User already exist! Please input a different email.' });
          } else {
            User.create({
              email: req.body.email,
              username: req.body.username,
              password_hash: req.body.password,
              food_restrictions: req.body.food_restrictions,
            }).then((userObject) => {
              res.json({ message: `${userObject} has been created. ` });
            }).catch(() => {
              res.status(400).json({ message: 'error creating user' });
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },

  logout(req, res) {
    req.logout();
    res.sendStatus(200);
  },


};

module.exports = AUTH_CONTROLLER.registerRoute();
