var express = require('express');
const { token } = require('morgan');
var router = express.Router();
var userControllers = require('../controller/users');
let { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require('../utils/constants');

/* GET users listing - requires mod or admin */
router.get('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  try {
    let users = await userControllers.getAllUsers()
    res.send({
      success: true,
      data: users
    });
  } catch (error) {
    next(error)
  }
});

/* GET user by ID - requires mod or admin (unless it's the user's own ID) */
router.get('/:id', check_authentication, async function (req, res, next) {
  try {
    const id = req.params.id;
    
    // Allow if user is requesting their own data
    if (id === req.user._id.toString()) {
      const user = await userControllers.getUserById(id);
      return res.send({
        success: true,
        data: user
      });
    }
    
    // Check if user is mod or admin for accessing other users' data
    if (constants.MOD_PERMISSION.includes(req.user.role.name)) {
      const user = await userControllers.getUserById(id);
      return res.send({
        success: true,
        data: user
      });
    }
    
    return res.status(403).send({
      success: false,
      message: "You don't have permission to access this resource"
    });
  } catch (error) {
    next(error);
  }
});

/* POST create user - requires admin */
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userControllers.createAnUser(
      body.username,
      body.password,
      body.email,
      body.role
    )
    res.status(200).send({
      success: true,
      message: newUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

/* PUT update user - requires admin */
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let updatedUser = await userControllers.updateAnUser(req.params.id, body);
    res.status(200).send({
      success: true,
      message: updatedUser
    });
  } catch (error) {
    next(error)
  }
});

/* DELETE user - requires admin */
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let deleteUser = await userControllers.deleteAnUser(req.params.id);
    res.status(200).send({
      success: true,
      message: deleteUser
    });
  } catch (error) {
    next(error)
  }
});

module.exports = router;