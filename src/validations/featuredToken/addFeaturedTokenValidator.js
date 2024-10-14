import { requiredType, valueRequired } from '../../middlewares/validators';

export default [
  valueRequired([
    { value: 'token_name', type: requiredType.string },
    { value: 'token_symbol', type: requiredType.string },
    { value: 'token_contract_address', type: requiredType.string },
  ]),
];
