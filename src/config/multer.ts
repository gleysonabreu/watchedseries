import multer, { Options } from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import path from 'path';
import crypto from 'crypto';

export const folder = path.join(__dirname, '..', '..', 'uploads');
const storageTypes = {
  local: multer.diskStorage({
    destination: folder,
    filename: (request, file, cb) => {
      const fieldHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fieldHash}-${Date.now()}-${file.originalname}`;
      file.key = filename;

      cb(null, filename);
    },
  }),

  amazonS3: multerS3({
    s3: new aws.S3(),
    bucket: 'uploads',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (request, file, cb) => {
      const fieldHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fieldHash}-${Date.now()}-${file.originalname}`;

      cb(null, filename);
    },
  }),
};

export default {
  storage: storageTypes.local,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/jpg',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid image type. Only png, jpeg, pjpeg, jpg, png is allowed!',
        ),
      );
    }
  },
} as Options;
