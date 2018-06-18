const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("../models/User.js");
var settings = require("../config/settings");
var jwt = require("jsonwebtoken");
const { requireAuth, getTokenForUser } = require("../config/auth");
const bcrypt = require("bcrypt");
const stripe = require("stripe")("sk_test_vY2PFCv47VGRTiS3Cb9c7uky");
const keyPublish = process.env.PUBLISHABLE_KEY;

User.create({
  name: "Admin",
  phone: "3104567683",
  email: "admin@admin.com",
  password: "automatichash"
});

const createUser = (req, res) => {
  const { name, phone, email, password } = req.body;
  const user = new User({ name, phone, email, password });
  user.save((err, user) => {
    if (err) return res.send(err);
    res.json({
      success: "User was saved",
      user
    });
  });
};

const userLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(500).json({ error: "Invalid Username/Password" });
      return;
    }
    if (user === null) {
      res.status(422).json({ error: "No user with that username in our DB" });
      return;
    }
    user.checkPassword(password, (nonMatch, hashMatch) => {
      // This is an example of using our User.method from our model.
      if (nonMatch !== null) {
        res.status(422).json({ error: "passwords dont match" });
        return;
      }
      if (hashMatch) {
        const token = getTokenForUser({
          username: user.email
        });
        res.json({ token });
      }
    });
  });
};

//Get profile if has one
const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id).exec((err, user) => {
    if (err) {
      res.status(422).json({ "That user doesn't exist": err });
      return;
    }
    res.json(user);
  });
};

//Useless route for now.
const getUsers = (req, res) => {
  // This controller will not work until a user has sent up a valid JWT
  // check out what's going on in services/index.js in the `validate` token function
  User.find({}, (err, users) => {
    if (err) return res.send(err);
    res.send(users);
  });
};

//User profile update
const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, phone, email, password } = req.body;

  bcrypt.hash(password, 11, (err, hash) => {
    if (err) return next(err);
    req.body.password = hash;

    User.findByIdAndUpdate(id, req.body, { new: true }).exec((err, user) => {
      if (err) {
        res.status(422).json({ "Could not find that user": err });
        return;
      }
      res.json(user);
    });
  });
};

const createCustomer = (req, res) => {
  const { email, cart } = req.body;
  const token = req.body.stripeToken;
  const makeCustomer = stripe.customers.create({
    email: email,
    source: token
  });
  makeCustomer
    .then(createdCustomer => res.json(createCustomer))
    .catch(err => res.json(err));
};

const createCharge = (req, res) => {
  const token = req.body.stripeToken;
  const { email } = req.body;
  const makeCharge = stripe.charges.create({
    amount: 1200,
    currency: "usd",
    description: "This is a sample charge",
    customer: email,
    source: token
  });
  makeCharge
    .then(createdCharge => res.json(createdCharge))
    .catch(err => res.json(err));
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  userLogin,
  createCharge
};
