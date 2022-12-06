const express = require("express");
const crypto = require("crypto");
const passport = require("passport");
const errors = require("../../lib/custom_errors");
const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;

const bcrypt = require("bcrypt");
const bcryptSaltRounds = 10;

const BadParamsError = errors.BadParamsError;
const BadCredentialsError = errors.BadCredentialsError;

const User = require("../models/user");

const requireToken = passport.authenticate("bearer", { session: false });

const router = express.Router();

// GET /users
// Get all users
router.get("/users", (req, res, next) => {
  User.find()
    .then(handle404)
    .then((users) => users.map((u) => u.toObject()))
    .then((users) => res.json({ users }))
    .catch(next);
});

// POST /sign-up
// Sign up and create a user
router.post("/sign-up", (req, res, next) => {
  Promise.resolve(req.body.credentials)
    .then((credentials) => {
      if (
        !credentials ||
        !credentials.password ||
        credentials.password !== credentials.password_confirmation
      ) {
        throw new BadParamsError();
      }
    })
    // generate a hash from the provided password, returning a promise
    .then(() => bcrypt.hash(req.body.credentials.password, bcryptSaltRounds))
    .then((hash) => {
      return {
        username: req.body.credentials.username,
        hashedPassword: hash,
      };
    })
    // create user with provided username and hashed password
    .then((user) => User.create(user))
    // send the new user object back with status 201, but `hashedPassword`
    // won't be send because of the `transform` in the User model
    .then((user) => res.status(201).json({ user: user.toObject() }))
    .catch(next);
});

// POST /sign-in
// sign in
router.post("/sign-in", (req, res, next) => {
  const pw = req.body.credentials.password;
  let user;

  User.findOne({ username: req.body.credentials.username })
    .then((record) => {
      if (!record) {
        throw new BadCredentialsError();
      }
      user = record;
      // `bcrypt.compare` will return true if the result of hashing `pw`
      // is exactly equal to the hashed password stored in the DB
      return bcrypt.compare(pw, user.hashedPassword);
    })
    .then((correctPassword) => {
      // if the passwords matched
      if (correctPassword) {
        // the token will be a 16 byte random hex string
        const token = crypto.randomBytes(16).toString("hex");
        user.token = token;
        return user.save();
      } else {
        throw new BadCredentialsError();
      }
    })
    .then((user) => {
      res.status(201).json({ user: user.toObject() });
    })
    .catch(next);
});

// PATCH /change-password
// change password
router.patch("/change-password", requireToken, (req, res, next) => {
  let user;
  // `req.user` will be determined by decoding the token payload
  User.findById(req.user.id)
    .then((record) => {
      user = record;
    })
    // check that the old password is correct
    .then(() => bcrypt.compare(req.body.passwords.old, user.hashedPassword))
    .then((correctPassword) => {
      if (!req.body.passwords.new || !correctPassword) {
        throw new BadParamsError();
      }
    })
    // hash the new password
    .then(() => bcrypt.hash(req.body.passwords.new, bcryptSaltRounds))
    .then((hash) => {
      user.hashedPassword = hash;
      return user.save();
    })
    .then(() => res.sendStatus(204))
    .catch(next);
});

// DELETE /sign-out
// Sign out
router.delete("/sign-out", requireToken, (req, res, next) => {
  // create a new random token for the user, invalidating the current one
  req.user.token = crypto.randomBytes(16);
  req.user
    .save()
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
