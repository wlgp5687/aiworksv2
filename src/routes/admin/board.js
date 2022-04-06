import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as boardController from '../../controllers/admin/board';
import * as boardValidator from '../../validators/admin/board';

const router = express.Router();

// 이벤트 등록
router.post(
	'/event',
	// ...boardValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.postEventBoardPost(req);
		return res.json(response);
	}),
);

// 공지사항 등록
router.post(
	'/notice',
	// ...boardValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.postNoticeBoardPost(req);
		return res.json(response);
	}),
);

// FAQ 등록
router.post(
	'/faq',
	// ...boardValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.postFaqBoardPost(req);
		return res.json(response);
	}),
);

// QNA  등록
router.post(
	'/qna',
	// ...boardValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.postQnaBoardPost(req);
		return res.json(response);
	}),
);

// 모집공고 등록
router.post(
	'/recruitment',
	// ...boardValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.postRecruitmentBoardPost(req);
		return res.json(response);
	}),
);

// 이벤트 상세 조회
router.get(
	'/event/:post_id',
	...boardValidator.getEventBoardPost,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getEventBoardPost(req);
		return res.json(response);
	}),
);

// 공지사항 상세 조회
router.get(
	'/notice/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getNoticeBoardPost(req);
		return res.json(response);
	}),
);

// FAQ 상세 조회
router.get(
	'/faq/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getFaqBoardPost(req);
		return res.json(response);
	}),
);

// QNA 상세 조회
router.get(
	'/qna/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getQnaBoardPost(req);
		return res.json(response);
	}),
);

// 모집공고 상세 조회
router.get(
	'/recruitment/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getRecruitmentBoardPost(req);
		return res.json(response);
	}),
);

// 이벤트 목록 조회
router.get(
	'/event',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getEventBoardList(req);
		return res.json(response);
	}),
);

// 공지사항 목록 조회
router.get(
	'/notice',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getNoticeBoardList(req);
		return res.json(response);
	}),
);

// FAQ 목록 조회
router.get(
	'/faq',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getFaqBoardList(req);
		return res.json(response);
	}),
);

// QNA 목록 조회
router.get(
	'/qna',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getQnaBoardList(req);
		return res.json(response);
	}),
);

// 모집공고 목록 조회
router.get(
	'/recruitment',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.getRecruitmentBoardList(req);
		return res.json(response);
	}),
);

// 이벤트 게시물 수정
router.patch(
	'/event/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.patchEventBoardPost(req);
		return res.json(response);
	}),
);

// 공지사항 게시물 수정
router.patch(
	'/notice/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.patchNoticeBoardPost(req);
		return res.json(response);
	}),
);

// FAQ 게시물 수정
router.patch(
	'/faq/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.patchFaqBoardPost(req);
		return res.json(response);
	}),
);

// QNA 게시물 수정
router.patch(
	'/qna/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.patchQnaBoardPost(req);
		return res.json(response);
	}),
);

// 모집공고 게시물 수정
router.patch(
	'/recruitment/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.patchRecruitmentBoardPost(req);
		return res.json(response);
	}),
);

// 이벤트 게시물 삭제
router.delete(
	'/event/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.deleteEventBoardPost(req);
		return res.json(response);
	}),
);

// 공지사항 게시물 삭제
router.delete(
	'/notice/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.deleteNoticeBoardPost(req);
		return res.json(response);
	}),
);

// FAQ 게시물 삭제
router.delete(
	'/faq/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.deleteFaqBoardPost(req);
		return res.json(response);
	}),
);

// QNA 게시물 삭제
router.delete(
	'/qna/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.deleteQnaBoardPost(req);
		return res.json(response);
	}),
);

// 모집공고 게시물 삭제
router.delete(
	'/recruitment/:post_id',
	// ...boardValidator.getLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await boardController.deleteRecruitmentBoardPost(req);
		return res.json(response);
	}),
);

export default router;
