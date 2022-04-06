import express from 'express';
import { wrapAsyncRouter } from '../services';
import * as certController from '../controllers/cert';

const router = express.Router();

// 계좌 인증
router.put(
	'/member/:memberId/account-name',
	wrapAsyncRouter(async (req, res) => {
		const accountValidation = await certController.checkAccountValidation(req);
		return res.status(200).json({ account_validation: accountValidation });
	}),
);

router.post(
	'/name-check',
	wrapAsyncRouter(async (req, res) => {
		const nameValidation = await certController.checkNameValidation(req);
		return res.status(200).json({ name_validation: nameValidation });
	}),
);

router.post(
	'/foreign-name-check',
	wrapAsyncRouter(async (req, res) => {
		const nameValidation = await certController.checkForeignNameValidation(req);
		return res.status(200).json({ name_validation: nameValidation });
	}),
)

export default router;
