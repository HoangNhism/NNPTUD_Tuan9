var express = require('express');
var router = express.Router();
const menuController = require('../controller/menus');
const { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require('../utils/constants');

/* GET all menus - no login required */
router.get('/', async function(req, res, next) {
  try {
    let menus = await menuController.getAllMenus();
    res.status(200).send({
      success: true,
      data: menus
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

/* GET menu by ID - no login required */
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let menu = await menuController.getMenuById(id);
    if (!menu) {
      return res.status(404).send({
        success: false,
        message: "Menu not found"
      });
    }
    res.status(200).send({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

/* GET menu by parent ID - no login required */
router.get('/byParent/:parentId?', async function(req, res, next) {
  try {
    let parentId = req.params.parentId || null;
    let menus = await menuController.getMenusByParent(parentId);
    res.status(200).send({
      success: true,
      data: menus
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

/* POST create menu - requires mod or admin */
router.post('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
  try {
    let body = req.body;
    let newMenu = await menuController.createMenu(
      body.text,
      body.URL,
      body.order,
      body.parent
    );
    res.status(201).send({
      success: true,
      data: newMenu
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

/* PUT update menu - requires mod or admin */
router.put('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
  try {
    let id = req.params.id;
    let body = req.body;
    let updatedMenu = await menuController.updateMenu(id, body);
    res.status(200).send({
      success: true,
      data: updatedMenu
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

/* DELETE menu - requires mod or admin */
router.delete('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
  try {
    let id = req.params.id;
    await menuController.deleteMenu(id);
    res.status(200).send({
      success: true,
      message: "Menu deleted successfully"
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;