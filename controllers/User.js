'use strict';

var utils = require('../utils/writer.js');
var Sequelize = require('sequelize');
var Users = require('../models').Users;
var LookupCommunicators = require('../models').LookupCommunicators;
var UserContents = require('../models').UserContents;
var auth = require("../utils/auth");

var service_User = require('../services/User');
const Op = Sequelize.Op;
module.exports.createUser = function createUser (req, res, next) {
  var user = req.swagger.params['user'].value;
  
  new Promise(function(resolve, reject) {
    Users
      .build(user)
      .save()
      .then(result => result == null ? reject() : resolve(result))
  })
  .then(response => {
    utils.writeJson(res, response);
  })
  .catch(() => {
    utils.writeJson(res, utils.respondWithCode(400, {error: 400, type: "error", message: "error"}))
  })
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  var id = req.swagger.params['id'].value;
  new Promise(function(resolve, reject) {
    Users.destroy({
      where: {
          UserId: id
      }
    }).then(result => result == null ? reject() : resolve(result))
  })
  .then(response => {
    utils.writeJson(res, response);
  })
  .catch(() => {
    utils.writeJson(res, utils.respondWithCode(400, {error: 400, type: "error", message: "error"}))
  })
};


module.exports.getUserByEmail = function getUserByEmail (req, res, next) {
  service_User.getUserByEmail(req, res, next);
};

module.exports.getUserById = function getUserById (req, res, next) {
  var id = req.swagger.params['id'].value;
  new Promise(function(resolve, reject) {
    Users.findOne({
      where: {UserId: id}
    })
    .then(result => result == null ? reject() : resolve(result))
  })
  .then(response => {
    utils.writeJson(res, response);
  })
  .catch(() => {
    utils.writeJson(res, utils.respondWithCode(400, {error: 400, type: "error", message: "not found"}))
  })
};

module.exports.loginUser = function loginUser (req, res, next) {
  var user = req.swagger.params['user'].value;
  new Promise(function(resolve, reject) {
    Users.findOne({
      where: {
        [Op.or]: [{PrimaryEmail: user.email}, {SecondaryEmail: user.email}]
      }
    })
    .then(result => result == null ? reject() : resolve({token: auth.generateToken(result.dataValues)}))
  })
  .then(response => {
    utils.writeJson(res, response);
  })
  .catch(() => {
    utils.writeJson(res, utils.respondWithCode(400, {error: 400, type: "login failed", message: "User email or password should be valid"}))
  })
};

module.exports.logoutUser = function logoutUser (req, res, next) {

};

module.exports.updateUser = function updateUser (req, res, next) {
  var id = req.swagger.params['id'].value;
  var user = req.swagger.params['user'].value;
  new Promise(function(resolve, reject) {
    Users.update(user, {
      where: {UserId: id},
    }).then(result => result == null ? reject() : resolve(result))
  })
  .then(response => {
    utils.writeJson(res, response);
  })
  .catch(() => {
    utils.writeJson(res, utils.respondWithCode(400, {error: 400, type: "error", message: "error"}))
  })
};

module.exports.getContentById = function getContentById (req, res, next) {
  service_User.getContentById(req, res, next);
}