import { handleExceptionResponse } from '../../utils/system';
import { authenticated, isProjectExisted } from '../../middlewares/policies';
import { liquidityService } from "../../services/liquidity.service";

const LiquidityController = require('express').Router();

LiquidityController.base = '';

/**
 * @description Get liquidity balance
 */
LiquidityController.post('/liquidity-balance', [
  authenticated(),
  isProjectExisted()
], async (req, res) => {
  try {
    const result = await liquidityService.getLiquidityBalance(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_LIQUIDITY_BALANCE_API', error);
  }
});

/**
 * @description Get liquidity percent
 */
LiquidityController.post('/liquidity-percent', [
  authenticated(),
  isProjectExisted()
], async (req, res) => {
  try {
    const result = await liquidityService.withdrawLPToken(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_LIQUIDITY_PERCENT_API', error);
  }
});

/**
 * @description Withdraw liquidity balance
 */
LiquidityController.post('/withdraw-liquidity', [
  authenticated(),
  isProjectExisted()
], async (req, res) => {
  try {
    const result = await liquidityService.withdrawLiquidity(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_WITHDRAW_LIQUIDITY_API', error);
  }
});

export { LiquidityController };
