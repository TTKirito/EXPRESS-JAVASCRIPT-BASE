import { requiredType, valueRequired } from '../../middlewares/validators';

export default [
  valueRequired([
    { value: 'locations', type: requiredType.array, formatObject: ['token_metrics_id', 'allocation_name', 'lock_percent', 'lock_detail'] }
  ]),
];
