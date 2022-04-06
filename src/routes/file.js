import express from 'express';
import multer from 'multer';
import { wrapAsyncRouter } from '../services';
import * as fileController from '../controllers/file';

const router = express.Router();
const upload = multer({ dest: 'tmp' });

// 파일업로드
router.post(
	'/',
	upload.array('file'),
	wrapAsyncRouter(async (req, res) => {
		const response = await fileController.uploadFile(req);
		return res.json(response);
	}),
);

export default router;
