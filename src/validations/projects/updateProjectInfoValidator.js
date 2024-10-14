import { requiredType, valueRequired } from '../../middlewares/validators';

export default [
  valueRequired([
    { value: 'project_logo', type: requiredType.string, required: false },
    { value: 'project_image', type: requiredType.string, required: false },
    { value: 'project_twitter', type: requiredType.text, required: false },
    { value: 'project_telegram', type: requiredType.text, required: false },
    { value: 'project_medium', type: requiredType.text, required: false },
    { value: 'project_discord', type: requiredType.text, required: false },
    { value: 'project_name', type: requiredType.string },
    { value: 'project_sub_title', type: requiredType.text },
    { value: 'sale_round_launch', type: requiredType.text, required: false },
    { value: 'project_website', type: requiredType.text },
    { value: 'project_email', type: requiredType.email },
    { value: 'project_white_paper', type: requiredType.text, required: false },
    { value: 'whitelist', type: requiredType.array, required: false, max: 10000 },
    { value: 'whitelist_address_csv', type: requiredType.string, required: false }
  ])
]
