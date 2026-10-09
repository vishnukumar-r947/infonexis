const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const storeService = require('../services/storeService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

router.get('/', protect, async (req, res) => {
  try {
    const actions = await storeService.getActions(req.user.id);
    return successResponse(res, actions);
  } catch (err) {
    return errorResponse(res, err.message);
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const action = await storeService.createAction({ ...req.body, userId: req.user.id });
    return successResponse(res, action, 'Action created', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const action = await storeService.updateAction(req.params.id, req.body);
    return successResponse(res, action, 'Action updated');
  } catch (err) {
    return errorResponse(res, err.message);
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await storeService.deleteAction(req.params.id, req.user?.id);
    if (result.notFound) {
      return errorResponse(res, 'Action not found', 404);
    }
    if (result.forbidden) {
      return errorResponse(res, 'Not authorized to delete this action', 403);
    }
    return successResponse(res, { id: req.params.id }, 'Action deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

module.exports = router;
