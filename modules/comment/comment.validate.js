import joi from "joi";

export const IdAndAuth = {
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
}
export const addOrEiditComment = {
    params:joi.object().required().keys({
        id:joi.string().required()
    }),
    body:joi.object().required().keys({
        commnetBody:joi.string().required()
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
}