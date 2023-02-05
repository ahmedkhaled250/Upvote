
import multer from 'multer'
import { nanoid } from 'nanoid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log(__dirname);

export const multerValidation = {
    image: ['image/png', 'image/jpeg', 'image/jif'],
    pdf: ['application/pdf'],

}

export const HME = (err, req, res, next) => {
    if (err) {
        res.status(400).json({ message: "Multer error", err })
    } else {
        next()
    }
}

export function myMulter(customPath, customValidation) {
    if (!customPath) {
        customPath = 'general'
    }
    const fullPath = path.join(__dirname, `../upload/${customPath}`)
    console.log({ fullPath });

    if (!customValidation) {
        customValidation = multerValidation.image
    }
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `upload/${customPath}`)
        },
        filename: function (req, file, cb) {
            console.log({ file });
            cb(null, nanoid() + "_" + file.originalname)
        }
    })
    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb('invalid format', false)
        }
    }
    const upload = multer({ dest: 'upload', fileFilter, storage })
    return upload
}