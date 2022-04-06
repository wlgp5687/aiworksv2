import { BlobServiceClient, StorageSharedKeyCredential, newPipeline } from '@azure/storage-blob';
import fs from 'fs';
import { getModel, transaction, sequelize } from '../../database';

const File = getModel('File');
const FileMaster = getModel('FileMaster');

const sharedKeyCredential = new StorageSharedKeyCredential(process.env.AZURE_STORAGE_USER, process.env.AZURE_STORAGE_KEY);
const pipeline = newPipeline(sharedKeyCredential);
const blobServiceUrl = `https://${process.env.AZURE_STORAGE_USER}.blob.core.windows.net`;

const blobServiceClient = new BlobServiceClient(blobServiceUrl, pipeline);
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const getBlobName = (originalName) => {
	const identifier = Math.random().toString().replace(/0\./, '');
	return `${identifier}-${originalName}`;
};

// 파일 생성
export const createFile = async (fileData, t) => {
	const response = await File.create(fileData, { transaction: t });
	return response;
};

// 파일 마스터 생성
export const createFileMaster = async (fileId, filekey, t) => {
	const response = await FileMaster.create({ file_id: fileId, file_key: filekey }, { transaction: t });
	return response;
};

// 파일 업로드
export const uploadFile = async (containerName, file, path, fileKey) => {
	let response = null;
	const blobName = getBlobName(file.filename);
	const stream = fs.createReadStream(file.path);
	const containerClient = blobServiceClient.getContainerClient(containerName);
	const pathName = `${path}${blobName}`;
	const blockBlobClient = containerClient.getBlockBlobClient(pathName);

	try {
		await blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers, { blobHTTPHeaders: { blobContentType: file.mimetype } });
		response = await sequelize.transaction(async (t) => {
			// 파일 생성
			const fileResponse = await createFile(
				{
					name: file.originalname,
					file_path: `/${containerName}/${path}${blobName}`,
					extension: file.mimetype,
					file_size: file.size,
				},
				t,
			);
			// 파일마스터 생성
			await createFileMaster(fileResponse.dataValues.id, fileKey, t);
			return fileResponse;
		});
		// 임시파일 삭제
		fs.unlink(file.path, function (error) {});
		return response;
	} catch (err) {
		response = { message: err.message };
		return response;
	}
};

// 파일key로 파일조회
export const getFilesByFileKey = async (fileKey) => {
	const response = await FileMaster.findOne({
		where: { file_key: fileKey },
		attributes: ['file_key'],
		include: [{ model: File, as: 'file', attributes: ['id', 'name', 'file_path'] }],
	});
	return response;
};
