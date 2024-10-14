import BigNumber from "bignumber.js"
import Web3 from 'web3';

const web3 = new Web3();

const bigNumber10Pow = (number, pow = 0, type = 10) => {
  return new BigNumber(number).multipliedBy(new BigNumber(10).pow(pow)).toString(type)
}

const convertBaseCurrency = (payment_currency, total_base) => {
  switch (payment_currency) {
    case 'ETH':
      return new BigNumber(total_base).dividedBy(bigNumber10Pow(1, 18)).toString(10);
    case 'USDT':
      return new BigNumber(total_base).dividedBy(bigNumber10Pow(1, 6)).toString(10);
    case 'BNB':
      return new BigNumber(total_base).dividedBy(bigNumber10Pow(1, 18)).toString(10);
    case 'BUSD':
      return new BigNumber(total_base).dividedBy(bigNumber10Pow(1, 18)).toString(10);
  }
}

const isValidWalletAddress = (address) => {
  try {
    return !!web3.utils.toChecksumAddress(address);
  } catch (error) {
    return false;
  }
}

const isStringNumeric = (str) => {
  if (typeof str != 'string') return false      // Only process strings!
  return !isNaN(str) && !isNaN(parseFloat(str)) // Ensure strings of whitespace fail
}

const convertTimeToSecond = (amount, type) => {
  const secondPerType = {
    MINUTES: 60,
    HOURS: 60 * 60,
    DAYS: 24 * 60 * 60,
    WEEKS: 7 * 24 * 60 * 60,
    MONTHS: 30 * 24 * 60 * 60
  }
  return new BigNumber(secondPerType[type].toString()).times(amount).toNumber();
}

const getRegexWithDecimalPlace = (decimalPlace) => {
  return new RegExp(`[0-9]*[.]?[0-9]{1,${decimalPlace}}`);
}

export {
  bigNumber10Pow,
  convertBaseCurrency,
  isValidWalletAddress,
  isStringNumeric,
  convertTimeToSecond,
  getRegexWithDecimalPlace
}
