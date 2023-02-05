import multer from "multer";
export const multerValidation = {
  image: ["image/png","image/jpg" , "image/jpeg", "image/jif"],
  pdf: ["application/pdf", "application/text","application/html"],
  video : ["video/mp4"]
};
export const HME = (err, req, res, next) => {
  if (err) {
    res.status(400).json({ message: "Multer error", err });
  } else {
    next();
  }
};
export function myMulter(customValidation) {
  if (!customValidation) {
    customValidation = multerValidation.image;
  }
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    console.log(file);
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("invalid format", false);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
}