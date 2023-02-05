const dataMethod = ["body", "params", "query", "headers"];

export const validation = (Schema) => {
  return (req, res, next) => {
    const validationErrArr = [];
    dataMethod.forEach((key) => {
      if (Schema[key]) {
        const validationResult = Schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult?.error) {
          validationErrArr.push(validationResult.error.details);
        }
      }
    });
    if (validationErrArr.length) {
      res.status(400).json({ message: "Validation error", validationErrArr });
    } else {
      next();
    }
  };
};
