import * as fileComponent from '../../components/file/file';
import { v1 as uuidv1 } from 'uuid';

// 파일업로드
export const uploadFile = async (containerName, files, path) => {
	const response = [];
	const fileKey = uuidv1();
	for (let i = 0; i < files.length; i++) {
		const filePath = await fileComponent.uploadFile(containerName, files[i], path, fileKey);
		response.push(filePath);
	}

	return { file_key: fileKey, files: response };
};
