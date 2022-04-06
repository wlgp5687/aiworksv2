import * as boardComponent from '../../../components/admin/board/board';
import { Op, sequelize } from '../../../database';
import { throwError } from '../..';

// 게시물 조회
export const getBoardPostByIdAndType = async (postId, postType) => {
	let post = null;
	switch (postType) {
		case 'event':
			post = await boardComponent.getEventBoardPostById(postId);
			break;
		case 'qna':
			post = await boardComponent.getQnaBoardPostById(postId);
			break;
		case 'faq':
			post = await boardComponent.getFaqBoardPostById(postId);
			break;
		case 'notice':
			post = await boardComponent.getNoticeBoardPostById(postId);
			break;
		case 'recruitment':
			post = await boardComponent.getRecruitmentBoardPostById(postId);
			break;
		default:
			throwError("Invalid 'post_type'.", 400);
			break;
	}

	// Return
	return post;
};

// 게시물 등록
export const postBoardPostByType = async (postData, postType) => {
	let post = null;
	await sequelize.transaction(async (t) => {
		switch (postType) {
			case 'event':
				post = await boardComponent.postEventBoardPost(postData, t);
				break;
			case 'qna':
				post = await boardComponent.postQnaBoardPost(postData, t);
				break;
			case 'faq':
				post = await boardComponent.postFaqBoardPost(postData, t);
				break;
			case 'notice':
				post = await boardComponent.postNoticeBoardPost(postData, t);
				break;
			case 'recruitment':
				post = await boardComponent.postRecruitmentBoardPost(postData, t);
				break;
			default:
				throwError("Invalid 'post_type'.", 400);
				break;
		}
	});

	// Return
	return post;
};

// 이벤트 목록 조회
export const getEventBoardList = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const common = searchFields.common ? searchFields.common : null;
	const order = [];
	let response = null;

	// 검색 조건
	const boardPostAttr = {};
	if (boardPost) {
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
		if (boardPost.is_public) boardPostAttr.is_public = boardPost.is_public;
		if (boardPost.title) boardPostAttr.title = { [Op.like]: `%${boardPost.title}%` };
		if (boardPost.post_id) boardPostAttr.id = boardPost.post_id;
		if (boardPost.start_date) boardPostAttr.start_date = { [Op.gte]: boardPost.start_date };
		if (boardPost.end_date) boardPostAttr.end_date = { [Op.lte]: boardPost.end_date };
		if (boardPost.event_status_cd) boardPostAttr.event_status_cd = boardPost.event_status_cd;
	}

	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC'], ['id', 'DESC']);
		if (common.order === 'first_at') order.push(['created_at', 'ASC'], ['id', 'ASC']);
		if (common.order === 'last_post_id') order.push(['id', 'DESC']);
		if (common.order === 'first_post_id') order.push(['id', 'ASC']);
	}

	response = await boardComponent.getEventBoardList(boardPostAttr, order, offset, limit);

	return response;
};

// 공지사항 목록 조회
export const getNoticeBoardList = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const common = searchFields.common ? searchFields.common : null;
	const order = [];
	let response = null;

	// 검색 조건
	const boardPostAttr = {};
	if (boardPost) {
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
		if (boardPost.is_public) boardPostAttr.is_public = boardPost.is_public;
		if (boardPost.title) boardPostAttr.title = { [Op.like]: `%${boardPost.title}%` };
		if (boardPost.post_id) boardPostAttr.id = boardPost.post_id;
	}

	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC'], ['id', 'DESC']);
		if (common.order === 'first_at') order.push(['created_at', 'ASC'], ['id', 'ASC']);
		if (common.order === 'last_post_id') order.push(['id', 'DESC']);
		if (common.order === 'first_post_id') order.push(['id', 'ASC']);
	}

	response = await boardComponent.getNoticeBoardList(boardPostAttr, order, offset, limit);

	return response;
};

// FAQ 목록 조회
export const getFaqBoardList = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const common = searchFields.common ? searchFields.common : null;
	const order = [];
	let response = null;

	// 검색 조건
	const boardPostAttr = {};
	if (boardPost) {
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
		if (boardPost.is_public) boardPostAttr.is_public = boardPost.is_public;
		if (boardPost.title) boardPostAttr.title = { [Op.like]: `%${boardPost.title}%` };
		if (boardPost.post_id) boardPostAttr.id = boardPost.post_id;
		if (boardPost.faq_category_cd) boardPostAttr.faq_category_cd = boardPost.faq_category_cd;
	}

	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC'], ['id', 'DESC']);
		if (common.order === 'first_at') order.push(['created_at', 'ASC'], ['id', 'ASC']);
		if (common.order === 'last_post_id') order.push(['id', 'DESC']);
		if (common.order === 'first_post_id') order.push(['id', 'ASC']);
	}

	response = await boardComponent.getFaqBoardList(boardPostAttr, order, offset, limit);

	return response;
};

// QNA 목록 조회
export const getQnaBoardList = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const common = searchFields.common ? searchFields.common : null;
	const order = [];
	let response = null;

	// 검색 조건
	const boardPostAttr = {};
	if (boardPost) {
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
		if (boardPost.is_public) boardPostAttr.is_public = boardPost.is_public;
		if (boardPost.title) boardPostAttr.title = { [Op.like]: `%${boardPost.title}%` };
		if (boardPost.post_id) boardPostAttr.id = boardPost.post_id;
		if (boardPost.qna_category_cd) boardPostAttr.qna_category_cd = boardPost.qna_category_cd;
		if (boardPost.qna_status_cd) boardPostAttr.qna_status_cd = boardPost.qna_status_cd;
		if (boardPost.qna_type_cd) boardPostAttr.qna_type_cd = boardPost.qna_type_cd;
	}

	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC'], ['id', 'DESC']);
		if (common.order === 'first_at') order.push(['created_at', 'ASC'], ['id', 'ASC']);
		if (common.order === 'last_post_id') order.push(['id', 'DESC']);
		if (common.order === 'first_post_id') order.push(['id', 'ASC']);
	}

	response = await boardComponent.getQnaBoardList(boardPostAttr, order, offset, limit);

	return response;
};

// 모집공고 목록 조회
export const getRecruitmentBoardList = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const boardPost = searchFields.board_post ? searchFields.board_post : null;
	const common = searchFields.common ? searchFields.common : null;
	const order = [];
	let response = null;

	// 검색 조건
	const boardPostAttr = {};
	if (boardPost) {
		if (boardPost.is_deleted) boardPostAttr.is_deleted = boardPost.is_deleted;
		if (boardPost.is_public) boardPostAttr.is_public = boardPost.is_public;
		if (boardPost.title) boardPostAttr.title = { [Op.like]: `%${boardPost.title}%` };
		if (boardPost.post_id) boardPostAttr.id = boardPost.post_id;
		if (boardPost.recruitment_status_cd) boardPostAttr.recruitment_status_cd = boardPost.recruitment_status_cd;
		if (boardPost.recruitment_type_cd) boardPostAttr.recruitment_type_cd = boardPost.recruitment_type_cd;
		if (boardPost.is_public) boardPostAttr.is_deadline = boardPost.is_deadline;
		if (boardPost.end_date) boardPostAttr.end_date = { [Op.lte]: boardPost.end_date };
	}

	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC'], ['id', 'DESC']);
		if (common.order === 'first_at') order.push(['created_at', 'ASC'], ['id', 'ASC']);
		if (common.order === 'last_post_id') order.push(['id', 'DESC']);
		if (common.order === 'first_post_id') order.push(['id', 'ASC']);
	}

	response = await boardComponent.getRecruitmentBoardList(boardPostAttr, order, offset, limit);

	return response;
};

// 이벤트 게시물 수정
export const patchEventBoardPost = async (boardPost) => {
	let response = null;

	await sequelize.transaction(async (t) => {
		const boardPostData = await boardComponent.updateEventBoardPost(boardPost, t);
		if (Object.keys(boardPostData).keys > 0) response = boardPostData;
	});

	return response;
};

// 공지사항 게시물 수정
export const patchNoticeBoardPost = async (boardPost) => {
	let response = null;

	await sequelize.transaction(async (t) => {
		const boardPostData = await boardComponent.updateNoticeBoardPost(boardPost, t);
		if (Object.keys(boardPostData).keys > 0) response = boardPostData;
	});

	return response;
};

// FAQ 게시물 수정
export const patchFaqBoardPost = async (boardPost) => {
	let response = null;

	await sequelize.transaction(async (t) => {
		const boardPostData = await boardComponent.updateFaqBoardPost(boardPost, t);
		if (Object.keys(boardPostData).keys > 0) response = boardPostData;
	});

	return response;
};

// Qna 게시물 수정
export const patchQnaBoardPost = async (boardPost) => {
	let response = null;

	await sequelize.transaction(async (t) => {
		const boardPostData = await boardComponent.updateQnaBoardPost(boardPost, t);
		if (Object.keys(boardPostData).keys > 0) response = boardPostData;
	});

	return response;
};

// 모집공고 게시물 수정
export const patchRecruitmentBoardPost = async (boardPost) => {
	let response = null;

	await sequelize.transaction(async (t) => {
		const boardPostData = await boardComponent.updateRecruitmentBoardPost(boardPost, t);
		if (Object.keys(boardPostData).keys > 0) response = boardPostData;
	});

	return response;
};

// 게시물 삭제
export const deleteBoardPostByIdAndType = async (postData, postType) => {
	await sequelize.transaction(async (t) => {
		switch (postType) {
			case 'event':
				await boardComponent.updateEventBoardPost(postData, t);
				break;
			case 'qna':
				await boardComponent.updateQnaBoardPost(postData, t);
				break;
			case 'faq':
				await boardComponent.updateFaqBoardPost(postData, t);
				break;
			case 'notice':
				await boardComponent.updateNoticeBoardPost(postData, t);
				break;
			case 'recruitment':
				await boardComponent.updateRecruitmentBoardPost(postData, t);
				break;
			default:
				throwError("Invalid 'post_type'.", 400);
				break;
		}
	});

	// Return
	return null;
};
