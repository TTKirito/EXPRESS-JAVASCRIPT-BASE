'use strict';

import Web3 from 'web3';
import { PROVIDERS } from '../../utils/constants';
import { ABI as ERC20ABI, bytecode as ERC20Bytecode } from "../../abi/ethereum/ERC20.js";
import { ABI as BEP20ABI, bytecode as BEP20Bytecode } from "../../abi/binance-smart-chain/BEP20.js";

export default {
    getWeb3Instance: (abi, network_id) => {
        const provider = PROVIDERS[network_id] || 0;
        if (provider === 0) throw new Error('INVALID_NETWORK_ID');

        const web3Instance = new Web3(Web3.givenProvider || provider);
        return new web3Instance.eth.Contract(abi);
    },

    getData: async (instance, data, params, from) => {
        const result = instance.deploy({ data, arguments: params });

        return {
            data: result.encodeABI(),
            gas: await result.estimateGas({ from }),
        };
    },

    getERC20Data: async function (params, network_id, from) {
      return await this.getData(this.getWeb3Instance(ERC20ABI, network_id), ERC20Bytecode, params, from);
    },

    getBEP20Data: async function (params, network_id, from) {
        return await this.getData(this.getWeb3Instance(BEP20ABI, network_id), BEP20Bytecode, params, from);
    }
}
