import { body } from 'express-validator';
import { requiredType, valueRequired } from '../../middlewares/validators';
import { DRAFT_TAB } from '../../models/schema/project-draft.model';
import { errors } from '../../utils/system';
import { Validator } from '../validator';

export default [
  valueRequired([
    { value: 'type', type: requiredType.string },
  ]),
  body('type')
    .custom(value => {
      return Object.keys(DRAFT_TAB).includes(value);
    })
    .withMessage(errors.INVALID_PROJECT_DRAFT_TYPE),
  Validator.check()
];
