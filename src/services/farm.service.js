import { errors, jsonError, jsonSuccess, logger } from "../utils/system";
import {
  PROVIDERS,
  TOKEN_DAL_ADDRESS,
  TOKEN_DAL_DECIMAL,
  FARM_ADDRESS,
} from "../utils/constants";
import Web3 from "web3";
import { ABI } from "../abi/ethereum/NFTFarm";
import { exchangeService } from "./uniswap.service";
import BigNumber from "bignumber.js";
const Tx = require("ethereumjs-tx");
import axios from "axios";
import { Jwt } from "../utils/jwt";

const callerAddress = getEnv("CALLER_ADDR");
const callerPrivKey = getEnv("CALLER_PRIV");
const nftUrl = getEnv("API_URL_NFT");

class FarmService {
  async createDALFarm({ wallet, project_id }) {
    try {
      const { wallet_id, network_id, wallet_address, wallet_type } = wallet;

      const provider = PROVIDERS[network_id];
      if (!provider) {
        return jsonError(errors.INVALID_NETWORK);
      }

      const farmAddress = FARM_ADDRESS[network_id];
      if (!farmAddress) {
        return jsonError(errors.INVALID_ADDRESS);
      }

      const dalAddress = TOKEN_DAL_ADDRESS[network_id];
      if (!dalAddress) {
        return jsonError(errors.INVALID_ADDRESS);
      }

      const web3 = new Web3(provider);
      const farmContract = new web3.eth.Contract(ABI, farmAddress);
      const newFarm = farmContract.methods.newFarm(
        1000,
        new BigNumber(1)
          .multipliedBy(new BigNumber(10).pow(TOKEN_DAL_DECIMAL))
          .toString(10),
        new BigNumber(10000)
          .multipliedBy(new BigNumber(10).pow(TOKEN_DAL_DECIMAL))
          .toString(10),
        dalAddress,
        wallet_address
      );
      const data = newFarm.encodeABI();
      const gasLimit = await newFarm.estimateGas({ from: callerAddress });
      const nonce = await web3.eth.getTransactionCount(callerAddress);
      let gasPrice = await exchangeService.getGasPrice({ wallet });
      gasPrice = gasPrice && gasPrice.result && gasPrice.result.result;

      // build transaction
      const rawTx = {
        nonce,
        gasPrice,
        gasLimit,
        to: farmAddress,
        value: "0x0",
        data,
      };

      const tx = new Tx(rawTx);

      // sign transaction
      tx.sign(Buffer.from(callerPrivKey, "hex"));
      const serializedTx = tx.serialize();

      // send transaction
      const res = await web3.eth.sendSignedTransaction(
        "0x" + serializedTx.toString("hex")
      );

      // decode log
      let createFarmEvent = [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "farm",
          type: "address",
        },
      ];

      const eventHash = web3.eth.abi.encodeEventSignature(
        "FarmCreated(address,address)"
      );

      let topics;
      let hexString;

      for (const log of res.logs) {
        if (log.topics[0] === eventHash) {
          hexString = log.data;
          topics = log.topics;
          break;
        }
      }

      topics.shift();
      const decodedEvent = web3.eth.abi.decodeLog(
        createFarmEvent,
        hexString,
        topics
      );

      const farm = decodedEvent.farm;

      // call api
      const token = await Jwt.sign({
        wallet_id: wallet_id,
        wallet_address: wallet_address,
        wallet_type: wallet_type,
        network_id,
        isAdmin: false,
      });

      const json = JSON.stringify({
        farm_contract_address: farm,
        max_amount_of_stakes: 10000,
        min_amount_of_stakes: 1,
        project_id,
        reward_rate: 1000,
        token_contract_address: dalAddress,
        token_decimal: TOKEN_DAL_DECIMAL,
        token_name: "DAOLaunch",
        token_symbol: "DAL",
      });

      const resFarm = await axios.post(`${nftUrl}/api/farm`, json, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return jsonSuccess(resFarm);
    } catch (error) {
      logger.error(`${new Date().toDateString()}_CREATE_NFT_FARM_ERROR`, error);
      return jsonError(errors.CREATE_NFT_FARM_ERROR);
    }
  }
}

export const farmService = new FarmService();
