import { body } from 'express-validator';
import { errors } from '../../utils/system';
import { Validator } from '../validator';

export default [
    body().isArray().withMessage("BODY_IS_ARRAY"),
    body('*.project_pitch_id')
        .optional()
        .isNumeric()
        .withMessage(errors.PROJECT_PITCH_ID_IS_NUMBER),
    body('*.navigation_title')
        .optional()
        .not()
        .isEmpty()        
        .withMessage(errors.NAVIGATION_TITLE_IS_STRING),
    body('*.uploaded_video')
        .optional()
        .not()
        .isEmpty()   
        .withMessage(errors.UPLOADED_VIDEO_IS_STRING),
    body('*.heading_title')
        .optional()
        .not()
        .isEmpty()           
        .withMessage(errors.HEADING_TITLE_IS_STRING),
    body('*.content')
        .optional()
        .not()
        .isEmpty()   
        .withMessage(errors.CONTENT_TITLE_IS_TEXT),
    body('*.order')
        .optional()
        .isNumeric({ no_symbols: true })
        .withMessage(errors.ORDER_IS_NUMBER),
    body('*.display')
        .optional()
        .isBoolean()
    .withMessage(errors.DISPLAY_IS_BOOLEAN),
    Validator.check()
]
