import { handleExceptionResponse } from '../../utils/system';
import { authenticated, isAdminWallet } from '../../middlewares/policies';
import { featuredTokenService } from '../../services/featured-token.service';
import addFeaturedTokenValidator from '../../validations/featuredToken/addFeaturedTokenValidator';

const FeaturedTokenController = require('express').Router();

FeaturedTokenController.base = 'featured-tokens';

/**
 * @description Add token
 */
FeaturedTokenController.post('/', [
  authenticated(),
  isAdminWallet(),
  addFeaturedTokenValidator,
], async (req, res) => {
  try {
    const result = await featuredTokenService.addFeaturedToken(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_ADD_FEATURED_TOKEN_API', error);
  }
});

/**
 * @description Get featured tokens
 */
FeaturedTokenController.get('/', [
  authenticated(),
  isAdminWallet(),
], async (req, res) => {
  try {
    const result = await featuredTokenService.getFeaturedTokens(req.query);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_FEATURED_TOKEN_API', error);
  }
});

/**
 * @description Delete token
 */
FeaturedTokenController.delete('/:id(\\d+)', [
  authenticated(),
  isAdminWallet(),
], async (req, res) => {
  try {
    const result = await featuredTokenService.deleteFeaturedToken(req.params);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_DELETE_FEATURED_TOKEN_API', error);
  }
});

export { FeaturedTokenController }
