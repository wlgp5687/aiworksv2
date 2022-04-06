import * as boardService from '../../services/admin/board/board';
import * as commonComponent from '../../components/common';

// 이벤트 상세 조회
export const getEventBoardPost = async (req) => {
	const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'event');
	// Return
	return boardPost ? { board_post: boardPost } : null;
};

// 공지사항 상세 조회
export const getNoticeBoardPost = async (req) => {
	const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'notice');
	// Return
	return boardPost ? { board_post: boardPost } : null;
};

// FAQ 상세 조회
export const getFaqBoardPost = async (req) => {
	const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'faq');
	// Return
	return boardPost ? { board_post: boardPost } : null;
};

// QNA 상세 조회
export const getQnaBoardPost = async (req) => {
	const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'qna');
	// Return
	return boardPost ? { board_post: boardPost } : null;
};

// 모집공고 상세 조회
export const getRecruitmentBoardPost = async (req) => {
	const boardPost = await boardService.getBoardPostByIdAndType(req.params.post_id, 'recruitment');
	// Return
	return boardPost ? { board_post: boardPost } : null;
};

// 이벤트 등록
export const postEventBoardPost = async (req) => {
	// 로그인한 관리자 인덱스
	const adminId = req.decodedToken.data.admin.id;

	// board_post
	const boardPost = {
		title: req.body.title,
		content: req.body.content,
		admin_id: adminId,
		is_deleted: 'N',
		is_public: 'Y',
		event_status_cd: 'STA1',
		short_desc: req.body.short_desc,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		file_key: req.body.file_key ? req.body.file_key : null,
		hit: 0,
	};

	const post = await boardService.postBoardPostByType(boardPost, 'event');

	// Return
	return !post ? null : { post };
};

// 공지사항 등록
export const postNoticeBoardPost = async (req) => {
	// 로그인한 관리자 인덱스
	const adminId = req.decodedToken.data.admin.id;

	// board_post
	const boardPost = {
		title: req.body.title,
		content: req.body.content,
		admin_id: adminId,
		is_deleted: 'N',
		is_public: 'Y',
		is_home: 'N',
		short_desc: req.body.short_desc,
		another_url: req.body.another_url,
		file_key: req.body.file_key ? req.body.file_key : null,
		hit: 0,
	};

	const post = await boardService.postBoardPostByType(boardPost, 'notice');

	// Return
	return !post ? null : { post };
};

// FAQ 등록
export const postFaqBoardPost = async (req) => {
	// 로그인한 관리자 인덱스
	const adminId = req.decodedToken.data.admin.id;

	// board_post
	const boardPost = {
		title: req.body.title,
		content: req.body.content,
		admin_id: adminId,
		is_deleted: 'N',
		is_public: 'Y',
		faq_category_cd: req.body.faq_category_cd,
	};

	const post = await boardService.postBoardPostByType(boardPost, 'faq');

	// Return
	return !post ? null : { post };
};

// QNA 등록
export const postQnaBoardPost = async (req) => {
	// 로그인한 관리자 인덱스

	// board_post
	const boardPost = {
		title: req.body.title,
		content: req.body.content,
		register_id: req.body.register_id,
		is_deleted: 'N',
		is_public: 'Y',
		qna_category_cd: req.body.qna_category_cd,
		qna_type_cd: req.body.qna_type_cd,
		qna_status_cd: 'STA1',
		file_key: req.body.file_key ? req.body.file_key : null,
		hit: 0,
	};

	const post = await boardService.postBoardPostByType(boardPost, 'qna');

	// Return
	return !post ? null : { post };
};

// 모집공고 등록
export const postRecruitmentBoardPost = async (req) => {
	// 로그인한 관리자 인덱스
	const adminId = req.decodedToken.data.admin.id;

	// board_post
	const boardPost = {
		title: req.body.title,
		content: req.body.content,
		admin_id: adminId,
		is_deleted: 'N',
		is_public: 'Y',
		file_key: req.body.file_key ? req.body.file_key : null,
		recruitment_status_cd: 'STA1',
		recruitment_type_cd: req.body.type,
		end_date: req.body.end_date,
		is_deadline: req.body.end_date ? 'Y' : 'N',
		hit: 0,
	};

	const post = await boardService.postBoardPostByType(boardPost, 'recruitment');

	// Return
	return !post ? null : { post };
};

// 이벤트 목록 조회
export const getEventBoardList = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const searchFields = {};

	// 검색 필터
	const boardPost = {};
	if (req.query.is_deleted) boardPost.is_deleted = req.query.is_deleted;
	if (req.query.is_public) boardPost.is_public = req.query.is_public;
	if (req.query.post_id) boardPost.post_id = req.query.post_id;
	if (req.query.title) boardPost.title = req.query.title;
	if (req.query.event_status_cd) boardPost.event_status_cd = req.query.event_status_cd;
	if (req.query.start_date) boardPost.start_date = req.query.start_date;
	if (req.query.end_date) boardPost.end_date = req.query.end_date;
	if (Object.keys(boardPost).length > 0) searchFields.board_post = boardPost;

	const common = {};
	if (req.query.order) common.order = req.query.order;
	if (Object.keys(common).length > 0) searchFields.common = common;

	// 이벤트 목록 조회
	const posts = await boardService.getEventBoardList(searchFields, offset, limit);
	// Return
	return !posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};

// 공지사항 목록 조회
export const getNoticeBoardList = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const searchFields = {};

	// 검색 필터
	const boardPost = {};
	if (req.query.is_deleted) boardPost.is_deleted = req.query.is_deleted;
	if (req.query.is_public) boardPost.is_public = req.query.is_public;
	if (req.query.post_id) boardPost.post_id = req.query.post_id;
	if (req.query.title) boardPost.title = req.query.title;
	if (Object.keys(boardPost).length > 0) searchFields.board_post = boardPost;

	const common = {};
	if (req.query.order) common.order = req.query.order;
	if (Object.keys(common).length > 0) searchFields.common = common;

	// 공지사항 목록 조회
	const posts = await boardService.getNoticeBoardList(searchFields, offset, limit);
	// Return
	return !posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};

// FAQ 목록 조회
export const getFaqBoardList = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const searchFields = {};

	// 검색 필터
	const boardPost = {};
	if (req.query.is_deleted) boardPost.is_deleted = req.query.is_deleted;
	if (req.query.is_public) boardPost.is_public = req.query.is_public;
	if (req.query.post_id) boardPost.post_id = req.query.post_id;
	if (req.query.title) boardPost.title = req.query.title;
	if (req.query.faq_category_cd) boardPost.faq_category_cd = req.query.faq_category_cd;
	if (Object.keys(boardPost).length > 0) searchFields.board_post = boardPost;

	const common = {};
	if (req.query.order) common.order = req.query.order;
	if (Object.keys(common).length > 0) searchFields.common = common;

	// FAQ 목록 조회
	const posts = await boardService.getFaqBoardList(searchFields, offset, limit);
	// Return
	return !posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};

// QNA 목록 조회
export const getQnaBoardList = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const searchFields = {};

	// 검색 필터
	const boardPost = {};
	if (req.query.is_deleted) boardPost.is_deleted = req.query.is_deleted;
	if (req.query.is_public) boardPost.is_public = req.query.is_public;
	if (req.query.post_id) boardPost.post_id = req.query.post_id;
	if (req.query.title) boardPost.title = req.query.title;
	if (req.query.qna_category_cd) boardPost.qna_category_cd = req.query.qna_category_cd;
	if (req.query.qna_type_cd) boardPost.qna_type_cd = req.query.qna_type_cd;
	if (req.query.qna_status_cd) boardPost.qna_status_cd = req.query.qna_status_cd;
	if (Object.keys(boardPost).length > 0) searchFields.board_post = boardPost;

	const common = {};
	if (req.query.order) common.order = req.query.order;
	if (Object.keys(common).length > 0) searchFields.common = common;

	// QNA 목록 조회
	const posts = await boardService.getQnaBoardList(searchFields, offset, limit);
	// Return
	return !posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};

// 모집공고 목록 조회
export const getRecruitmentBoardList = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const searchFields = {};

	// 검색 필터
	const boardPost = {};
	if (req.query.is_deleted) boardPost.is_deleted = req.query.is_deleted;
	if (req.query.is_public) boardPost.is_public = req.query.is_public;
	if (req.query.post_id) boardPost.post_id = req.query.post_id;
	if (req.query.title) boardPost.title = req.query.title;
	if (req.query.recruitment_type_cd) boardPost.recruitment_type_cd = req.query.recruitment_type_cd;
	if (req.query.recruitment_status_cd) boardPost.recruitment_status_cd = req.query.recruitment_status_cd;
	if (req.query.end_date) boardPost.end_date = req.query.end_date;
	if (req.query.is_deadline) boardPost.is_deadline = req.query.is_deadline;
	if (Object.keys(boardPost).length > 0) searchFields.board_post = boardPost;

	const common = {};
	if (req.query.order) common.order = req.query.order;
	if (Object.keys(common).length > 0) searchFields.common = common;

	// 모집공고 목록 조회
	const posts = await boardService.getRecruitmentBoardList(searchFields, offset, limit);
	// Return
	return !posts ? null : { ...posts, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};

// 이벤트 게시물 수정
export const patchEventBoardPost = async (req) => {
	const boardPost = {
		id: req.params.post_id,
		title: req.body.title,
		content: req.body.content,
		is_deleted: req.body.is_deleted,
		is_public: req.body.is_public,
		event_status_cd: req.body.event_status_cd,
		short_desc: req.body.short_desc,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		file_key: req.body.file_key,
		hit: req.body.hit,
	};

	await boardService.patchEventBoardPost(boardPost);
	// Return
	return null;
};

// 공지사항 게시물 수정
export const patchNoticeBoardPost = async (req) => {
	const boardPost = {
		id: req.params.post_id,
		title: req.body.title,
		content: req.body.content,
		is_deleted: req.body.is_deleted,
		is_public: req.body.is_public,
		is_home: req.body.is_home,
		short_desc: req.body.short_desc,
		another_url: req.body.another_url,
		file_key: req.body.file_key,
		hit: req.body.hit,
	};

	await boardService.patchNoticeBoardPost(boardPost);
	// Return
	return null;
};

// FAQ 게시물 수정
export const patchFaqBoardPost = async (req) => {
	const boardPost = {
		id: req.params.post_id,
		title: req.body.title,
		content: req.body.content,
		is_deleted: req.body.is_deleted,
		is_public: req.body.is_public,
		faq_category_cd: req.body.faq_category_cd,
	};

	await boardService.patchFaqBoardPost(boardPost);
	// Return
	return null;
};

// QNA 게시물 수정
export const patchQnaBoardPost = async (req) => {
	const adminId = req.decodedToken.data.admin.id;
	const boardPost = {
		id: req.params.post_id,
		title: req.body.title,
		content: req.body.content,
		is_deleted: req.body.is_deleted,
		is_public: req.body.is_public,
		qna_status_cd: req.body.qna_status_cd,
		qna_category_cd: req.body.qna_category_cd,
		qna_type_cd: req.body.qna_type_cd,
		reply_title: req.body.reply_title,
		reply_content: req.body.reply_content,
		reply_admin_id: req.body.reply_title ? adminId : req.body.reply_admin_id,
		reply_date: req.body.reply_date,
		file_key: req.body.file_key,
		hit: req.body.hit,
	};

	await boardService.patchQnaBoardPost(boardPost);
	// Return
	return null;
};

// 모집공고 게시물 수정
export const patchRecruitmentBoardPost = async (req) => {
	const boardPost = {
		id: req.params.post_id,
		title: req.body.title,
		content: req.body.content,
		is_deleted: req.body.is_deleted,
		is_public: req.body.is_public,
		file_key: req.body.file_key,
		recruitment_status_cd: req.body.recruitment_status_cd,
		recruitment_type_cd: req.body.recruitment_type_cd,
		end_date: req.body.end_date,
		is_deadline: req.body.end_date ? 'Y' : 'N',
		hit: req.body.hit,
	};

	await boardService.patchRecruitmentBoardPost(boardPost);
	// Return
	return null;
};

// 이벤트 게시물 삭제
export const deleteEventBoardPost = async (req) => {
	const boardPost = { id: req.params.post_id, is_deleted: 'Y' };
	await boardService.deleteBoardPostByIdAndType(boardPost, 'event');
	// Return
	return null;
};

// 공지사항 게시물 삭제
export const deleteNoticeBoardPost = async (req) => {
	const boardPost = { id: req.params.post_id, is_deleted: 'Y' };
	await boardService.deleteBoardPostByIdAndType(boardPost, 'notice');
	// Return
	return null;
};

// FAQ 게시물 삭제
export const deleteFaqBoardPost = async (req) => {
	const boardPost = { id: req.params.post_id, is_deleted: 'Y' };
	await boardService.deleteBoardPostByIdAndType(boardPost, 'faq');
	// Return
	return null;
};

// QNA 게시물 삭제
export const deleteQnaBoardPost = async (req) => {
	const boardPost = { id: req.params.post_id, is_deleted: 'Y' };
	await boardService.deleteBoardPostByIdAndType(boardPost, 'qna');
	// Return
	return null;
};

// 모집공고 게시물 삭제
export const deleteRecruitmentBoardPost = async (req) => {
	const boardPost = { id: req.params.post_id, is_deleted: 'Y' };
	await boardService.deleteBoardPostByIdAndType(boardPost, 'recruitment');
	// Return
	return null;
};
