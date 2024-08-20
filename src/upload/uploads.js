import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		try {
			cb(null, 'src/upload/');
		} catch (err) {
			cb(err);
		}
	},
	filename: (req, file, cb) => {
		try {
			let extension = path.extname(file.originalname);
			cb(null, Date.now() + extension);
		} catch (err) {
			cb(err);
		}
	},
});

const uploads = multer({
	storage,
});

export default uploads;
