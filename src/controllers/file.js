import * as fileService from '../services/file/file';

// 파일 업로드
export const uploadFile = async (req) => {
	const files = req.files;
	const path = req.body.file_path ? `${req.body.file_path}` : '';
	const containerName = req.body.container;

	const response = await fileService.uploadFile(containerName, files, path);

	return response;
};
