import { Sequelize } from 'sequelize';
import { getModel, Op } from '../../../database';

const Code = getModel('Code');
const FileMaster = getModel('FileMaster');
const File = getModel('File');
const Event = getModel('Event');
const Notice = getModel('Notice');
const Faq = getModel('Faq');
const Qna = getModel('Qna');
const Recruitment = getModel('Recruitment');
const Member = getModel('Member');

// 이벤트 게시물 작성
export const postEventBoardPost = async (postData, t) => {
	const response = await Event.create(postData, { transaction: t });
	return response;
};

// 공지사항 게시물 작성
export const postNoticeBoardPost = async (postData, t) => {
	const response = await Notice.create(postData, { transaction: t });
	return response;
};

// FAQ 게시물 작성
export const postFaqBoardPost = async (postData, t) => {
	const response = await Faq.create(postData, { transaction: t });
	return response;
};

// QNA 게시물 작성
export const postQnaBoardPost = async (postData, t) => {
	const response = await Qna.create(postData, { transaction: t });
	return response;
};

// 모집공고 게시물 작성
export const postRecruitmentBoardPost = async (postData, t) => {
	const response = await Recruitment.create(postData, { transaction: t });
	return response;
};

// 이벤트 게시물 조회
export const getEventBoardPostById = async (postId) => {
	const response = await Event.findOne({
		where: { id: postId },
		attributes: ['id', 'title', 'content', 'event_status_cd', 'is_deleted', 'is_public', 'hit', 'start_date', 'end_date', 'short_desc'],
		include: [
			{
				model: File,
				as: 'file',
				attributes: ['id', 'name', 'file_path'],
				through: {
					attributes: [],
				},
			},
		],
	});
	return response;
};

// 공지사항 게시물 조회
export const getNoticeBoardPostById = async (postId) => {
	const response = await Notice.findOne({
		where: { id: postId },
		attributes: ['id', 'title', 'content', 'is_deleted', 'is_public', 'is_home', 'hit', 'another_url', 'short_desc'],
		include: [
			{
				model: File,
				as: 'file',
				attributes: ['id', 'name', 'file_path'],
				through: {
					attributes: [],
				},
			},
		],
	});
	return response;
};

// FAQ 게시물 조회
export const getFaqBoardPostById = async (postId) => {
	const response = await Faq.findOne({
		where: { id: postId },
		attributes: ['id', 'title', 'content', 'is_deleted', 'is_public'],
		include: [
			{
				model: Code,
				as: 'faq_category',
				attributes: ['id', 'code', 'code_name'],
				where: { code_type: 'faq_category' },
			},
		],
	});
	return response;
};

// QNA 게시물 조회
export const getQnaBoardPostById = async (postId) => {
	const response = await Qna.findOne({
		where: { id: postId },
		attributes: [
			'id',
			'title',
			'content',
			'admin_id',
			'qna_status_cd',
			'qna_category_cd',
			'qna_type_cd',
			'is_deleted',
			'is_public',
			'reply_title',
			'reply_content',
			'reply_admin_id',
			'reply_date',
			'hit',
			'created_at',
			'updated_at',
		],
		include: [
			{
				model: Member,
				as: 'register',
				attributes: ['id', 'login_id', 'email'],
			},
		],
	});
	return response;
};

// 모집공고 게시물 조회
export const getRecruitmentBoardPostById = async (postId) => {
	const response = await Recruitment.findOne({
		where: { id: postId },
		attributes: ['id', 'title', 'content', 'recruitment_status_cd', 'recruitment_type_cd', 'is_deleted', 'is_public', 'hit', 'is_deadline', 'end_date'],
		include: [
			{
				model: File,
				as: 'file',
				attributes: ['id', 'name', 'file_path'],
				through: {
					attributes: [],
				},
			},
		],
	});
	return response;
};

// 이벤트 게시물 목록 조회
export const getEventBoardList = async (boardPostAttr, order, offset = 0, limit = 10) => {
	let response = null;
	const sql = {
		where: boardPostAttr,
		distinct: true,
	};

	// Total
	const total = await Event.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'title',
			'content',
			'admin_id',
			'is_deleted',
			'is_public',
			'event_status_cd',
			'hit',
			'start_date',
			'end_date',
			'short_desc',
			'created_at',
			'updated_at',
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = order;

		// 게시물 정보 조회
		const postData = await Event.findAll(sql);
		if (Object.keys(postData).length > 0) response = { total, list: postData };
	}

	// Return
	return response;
};

// 공지사항 게시물 목록 조회
export const getNoticeBoardList = async (boardPostAttr, order, offset = 0, limit = 10) => {
	let response = null;
	const sql = {
		where: boardPostAttr,
		distinct: true,
	};

	// Total
	const total = await Notice.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'title', 'content', 'admin_id', 'is_deleted', 'is_public', 'hit', 'is_home', 'short_desc', 'another_url', 'created_at', 'updated_at'];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = order;

		// 게시물 정보 조회
		const postData = await Notice.findAll(sql);
		if (Object.keys(postData).length > 0) response = { total, list: postData };
	}

	// Return
	return response;
};

// FAQ 게시물 목록 조회
export const getFaqBoardList = async (boardPostAttr, order, offset = 0, limit = 10) => {
	let response = null;
	const sql = {
		where: boardPostAttr,
		distinct: true,
	};

	// Total
	const total = await Faq.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'title', 'content', 'admin_id', 'is_deleted', 'is_public', 'faq_category_cd', 'created_at', 'updated_at'];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = order;

		// 게시물 정보 조회
		const postData = await Faq.findAll(sql);
		if (Object.keys(postData).length > 0) response = { total, list: postData };
	}

	// Return
	return response;
};

// QNA 게시물 목록 조회
export const getQnaBoardList = async (boardPostAttr, order, offset = 0, limit = 10) => {
	let response = null;
	const sql = {
		include: [
			{
				model: Member,
				as: 'register',
				attributes: ['id', 'login_id', 'email'],
			},
		],
		where: boardPostAttr,
		distinct: true,
	};

	// Total
	const total = await Qna.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'title',
			'content',
			'admin_id',
			'is_deleted',
			'is_public',
			'qna_status_cd',
			'qna_category_cd',
			'qna_type_cd',
			'reply_title',
			'reply_content',
			'reply_admin_id',
			'reply_date',
			'hit',
			'created_at',
			'updated_at',
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = order;

		// 게시물 정보 조회
		const postData = await Qna.findAll(sql);
		if (Object.keys(postData).length > 0) response = { total, list: postData };
	}

	// Return
	return response;
};

// 모집공고 게시물 목록 조회
export const getRecruitmentBoardList = async (boardPostAttr, order, offset = 0, limit = 10) => {
	let response = null;
	const sql = {
		where: boardPostAttr,
		distinct: true,
	};

	// Total
	const total = await Recruitment.count(sql);

	if (total && total > 0) {
		sql.attributes = [
			'id',
			'title',
			'content',
			'admin_id',
			'is_deleted',
			'is_public',
			'recruitment_status_cd',
			'recruitment_type_cd',
			'is_deadline',
			'end_date',
			'hit',
			'created_at',
			'updated_at',
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = order;

		// 게시물 정보 조회
		const postData = await Recruitment.findAll(sql);
		if (Object.keys(postData).length > 0) response = { total, list: postData };
	}

	// Return
	return response;
};

// 이벤트 게시물 수정
export const updateEventBoardPost = async (boardPost, t) => {
	const response = await Event.update(
		{
			title: boardPost.title,
			content: boardPost.content,
			is_deleted: boardPost.is_deleted,
			is_public: boardPost.is_public,
			event_status_cd: boardPost.event_status_cd,
			short_desc: boardPost.short_desc,
			start_date: boardPost.start_date,
			end_date: boardPost.end_date,
			file_key: boardPost.file_key,
			hit: boardPost.hit,
		},
		{ where: { id: boardPost.id }, transaction: t },
	);
	return response;
};

// 공지사항 게시물 수정
export const updateNoticeBoardPost = async (boardPost, t) => {
	const response = await Notice.update(
		{
			title: boardPost.title,
			content: boardPost.content,
			is_deleted: boardPost.is_deleted,
			is_public: boardPost.is_public,
			is_home: boardPost.is_home,
			short_desc: boardPost.short_desc,
			another_url: boardPost.another_url,
			file_key: boardPost.file_key,
			hit: boardPost.hit,
		},
		{ where: { id: boardPost.id }, transaction: t },
	);
	return response;
};

// FAQ 게시물 수정
export const updateFaqBoardPost = async (boardPost, t) => {
	const response = await Faq.update(
		{
			title: boardPost.title,
			content: boardPost.content,
			is_deleted: boardPost.is_deleted,
			is_public: boardPost.is_public,
			faq_category_cd: boardPost.faq_category_cd,
		},
		{ where: { id: boardPost.id }, transaction: t },
	);
	return response;
};

// QNA 게시물 수정
export const updateQnaBoardPost = async (boardPost, t) => {
	const response = await Qna.update(
		{
			title: boardPost.title,
			content: boardPost.content,
			is_deleted: boardPost.is_deleted,
			is_public: boardPost.is_public,
			qna_status_cd: boardPost.qna_status_cd,
			qna_category_cd: boardPost.qna_category_cd,
			qna_type_cd: boardPost.qna_type_cd,
			reply_title: boardPost.reply_title,
			reply_content: boardPost.reply_content,
			reply_admin_id: boardPost.reply_admin_id,
			reply_date: boardPost.reply_date,
			file_key: boardPost.file_key,
			hit: boardPost.hit,
		},
		{ where: { id: boardPost.id }, transaction: t },
	);
	return response;
};

// 모집공고 게시물 수정
export const updateRecruitmentBoardPost = async (boardPost, t) => {
	const response = await Recruitment.update(
		{
			title: boardPost.title,
			content: boardPost.content,
			is_deleted: boardPost.is_deleted,
			is_public: boardPost.is_public,
			file_key: boardPost.file_key,
			recruitment_status_cd: boardPost.recruitment_status_cd,
			recruitment_type_cd: boardPost.recruitment_type_cd,
			end_date: boardPost.end_date,
			is_deadline: boardPost.is_deadline,
			hit: boardPost.hit,
		},
		{ where: { id: boardPost.id }, transaction: t },
	);
	return response;
};
