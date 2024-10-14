import { handleExceptionResponse } from '../../utils/system';
import { walletUserInfosService } from "../../services/wallet-user-infos.service";
import { checkAPIKey } from '../../middlewares/policies';

const AdminConfigController = require('express').Router();

AdminConfigController.base = 'admin-config';

/**
 * @description Save admin wallet
 */
AdminConfigController.post('/', [
  checkAPIKey()
], async (req, res) => {
  try {
    const result = await walletUserInfosService.createMultiAdminWallet(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_CREATE_MULTI_ADMIN_WALLET_API', error);
  }
});

AdminConfigController.put('/update-admin-wallet', [
  checkAPIKey()
], async (req, res) => {
  try {
    const result = await walletUserInfosService.updateMultiAdminWallet(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_UPDATE_ADMIN_WALLET_API', error);
  }
});

export { AdminConfigController }
