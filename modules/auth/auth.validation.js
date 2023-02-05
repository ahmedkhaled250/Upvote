import joi from "joi";

export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().required(),
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      gender: joi.string(),
      role: joi.string(),
      age:joi.number(),
    }),
};
export const token = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
export const logout = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const signin = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
    }),
};
