import joi from "joi";

export const updateProfile = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string(),
      email: joi.string().email(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        ),
      gender: joi.string(),
      age: joi.number(),
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const softdelete = {
    query:joi.object().required().keys({
        id:joi.string()
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const blockUserAndProfile = {
    params:joi.object().required().keys({
        id:joi.string().required()
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const pictures = {
    body:joi.object().required().keys({
        // file:joi.string().required()
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const allusers = {
    query:joi.object().required().keys({
        page:joi.number(),
        size:joi.number()
    })
};
