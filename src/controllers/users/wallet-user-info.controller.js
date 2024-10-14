import { handleExceptionResponse, jsonSuccess } from '../../utils/system';
import { authenticated } from '../../middlewares/policies';
import {walletUserInfosService} from "../../services/wallet-user-infos.service";

const WalletUserInfoController = require('express').Router();

WalletUserInfoController.base = 'wallet-user-info';

/**
 * @description Login
 */
WalletUserInfoController.put('/edit', [
  authenticated(),
], async (req, res) => {
  try {
    const { wallet_id } = req.body.wallet;
    const { display_name, avatar_url } = req.body;
    const result = await walletUserInfosService.editWalletUserInfo({wallet_id, display_name, avatar_url});
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_EDIT_WALLET_USER_INFO_API', error);
  }
});

/**
 * @description Get my wallet
 */
WalletUserInfoController.get('/detail', [
  authenticated(),
], async (req, res) => {
  try {
    const { wallet_id } = req.body.wallet;
    const result = await walletUserInfosService.getWalletUserInfo({wallet_id});
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_WALLET_USER_INFO_API', error);
  }
});

/**
 * @description Get all wallet user infos
 */
WalletUserInfoController.get('/', [
  authenticated(),
], async (req, res) => {
  try {
    const result = await walletUserInfosService.getListWalletUserInfos();
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_GET_WALLET_USER_INFO_API', error);
  }
});

export { WalletUserInfoController }
