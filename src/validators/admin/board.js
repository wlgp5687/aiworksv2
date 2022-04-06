import { check } from 'express-validator/check';
import { validate } from '../index';

// FAQ 게시물 조회
export const getFaqBoardPost = validate([check('post_id').exists({ checkFalsy: true }).toInt().isNumeric().not().isEmpty()]);

// 이벤트 게시물 조회
export const getEventBoardPost = validate([check('post_id').exists({ checkFalsy: true }).toInt().isNumeric().not().isEmpty()]);
