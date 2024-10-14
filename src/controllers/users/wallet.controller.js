import { handleExceptionResponse, jsonSuccess } from '../../utils/system';
import { walletService } from '../../services/wallet.service';
import { authenticated, isChainIdValid, isValidNetworkId, isWalletValid } from '../../middlewares/policies';
import verifyWalletValidator from '../../validations/wallets/verifyWalletValidator';

const WalletController = require('express').Router();

WalletController.base = 'wallet';

/**
 * @description Login
 */
WalletController.post('/verify', [
  verifyWalletValidator,
  isChainIdValid(),
  isWalletValid(),
  isValidNetworkId(true),
], async (req, res) => {
  try {
    const result = await walletService.saveWalletAndGenerateToken(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_VERIFY_WALLET_API', error);
  }
});

/**
 * @description Get my wallet
 */
WalletController.get('/my-wallet', [
  authenticated(),
], async (req, res) => {
  try {
    const result = await walletService.getMyWallet(req.body);
    res.json(result);
  } catch (error) {
    handleExceptionResponse(res, 'ERRORS_MY_WALLET_API', error);
  }
});

export { WalletController }
