import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import fs from 'fs';
// Define __dirname
const __filename = fileURLToPath(import.meta.url);

const uploadPath = path.join(path.dirname(__filename), '..', 'uploads'); // Adjust as needed

if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath, { recursive: true });
}

const uploadFile = () => {
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			try {
				cb(null, uploadPath);
			} catch (err) {
				cb(err.message);
			}
		},
		filename: (req, file, cb) => {
			try {
				cb(null, uuidv4() + '_' + file.originalname);
			} catch (err) {
				cb(err);
			}
		},
	});

	function fileFilter(req, file, cb) {
		if (file.mimetype.startsWith('image')) {
			return cb(null, true);
		}

		cb(new Error('invalid image type'), false);
	}

	const upload = multer({
		storage,
		fileFilter,
	});

	return upload;
};

const uploadSingle = (fieldName) => uploadFile().single(fieldName);
const uploadArray = (fieldName) => uploadFile().array(fieldName, 10);

const uploadFields = (fieldslist) => uploadFile().fields(fieldslist);

export { uploadSingle, uploadArray, uploadFields };
