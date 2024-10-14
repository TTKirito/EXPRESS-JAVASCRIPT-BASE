import { handleExceptionResponse } from '../../utils/system';
import { authenticated, isValidNetworkId } from '../../middlewares/policies';
import { tokenService } from '../../services/token.service';
import createTokenValidator from '../../validations/tokens/createTokenValidator';
import createTokenMetricsValidator from '../../validations/tokens/createTokenMetricsValidator';
import generateTokenValidator from '../../validations/tokens/generateTokenValidator';

const TokenController = require('express').Router();

TokenController.base = 'token';

/**
 * @description Create new token
 */
TokenController.post('/', [
  authenticated(),
  isValidNetworkId(),
  createTokenValidator,
], async (req, res) => {
  try {
    const result = await tokenService.createToken(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_CREATE_TOKEN_API', error);
  }
});

/**
 * @description Generate token data
 */
TokenController.post('/token-data', [
  authenticated(),
  generateTokenValidator,
], async (req, res) => {
  try {
    const result = await tokenService.generateTokenData(req.body, req.query);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_TOKEN_DATA_API', error);
  }
});

/**
 * @description My tokens
 */
TokenController.get('/', [
  authenticated(),
], async (req, res) => {
  try {
    const result = await tokenService.getMyTokens(req.body, req.query);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_MY_TOKEN_API', error);
  }
});

/**
 * @description Get detail of token by address
 */
TokenController.get('/:address', [
  authenticated(false),
], async (req, res) => {
  try {
    const result = await tokenService.getDetailOfTokenByAddress(req.params, req.body, req.query);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_TOKEN_DETAIL_BY_ADDRESS_API', error);
  }
});

/**
 * @description Get approve data
 */
TokenController.post('/approve/data', [
  // authenticated(),
], async (req, res) => {
  try {
    const result = await tokenService.getApproveTokenData(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_APPROVE_TOKEN_DATA_API', error);
  }
});

/**
 * @description Get usdt balance
 */
TokenController.get('/balance/usdt', [
  authenticated(),
], async (req, res) => {
  try {
    const result = await tokenService.getUSDTBalance(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_USDT_BALANCE_API', error);
  }
});

/**
 * @description Submit setting token metrics
 */
TokenController.post('/:id(\\d+)/token-metrics/submit', [
  authenticated(),
  isValidNetworkId(),
], async (req, res) => {
  try {
    const result = await tokenService.settingTokenMetrics(req.params,req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_SUBMIT_SETTING_TOKEN_METRICS_API', error);
  }
});

/**
 * @description Confirm setting token metrics
 */
TokenController.post('/:id(\\d+)/token-metrics/confirm', [
  authenticated(),
  isValidNetworkId(),
  createTokenMetricsValidator,
], async (req, res) => {
  try {
    const result = await tokenService.confirmSettingTokenMetrics(req.params,req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_CONFIRM_TOKEN_METRICS_API', error);
  }
});

/**
 * Get token metrics
 */
TokenController.get('/:id(\\d+)/token-metrics', [
  authenticated(),
  isValidNetworkId()
], async (req, res) => {
  try {
    const result = await tokenService.getTokenMetricsInfo(req.params, req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_TOKEN_METRICS_API', error);
  }
});

/**
 * Claim token metrics
 */
TokenController.post('/:id(\\d+)/token-metrics/claim', [
  authenticated(),
  isValidNetworkId()
], async (req, res) => {
  try {
    const result = await tokenService.getClaimData(req.params, req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_CLAIM_DATA_TOKEN_METRICS_API', error);
  }
});

/**
 * Get token owner
 */
TokenController.get('/get-owner/:token', [
  authenticated(),
  isValidNetworkId()
], async (req, res) => {
  try {
    const result = await tokenService.getTokenOwner(req.params, req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_TOKEN_OWNER_API', error);
  }
});

export { TokenController }
