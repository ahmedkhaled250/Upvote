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
export const addPost = {
    body:joi.object().required().keys({
        postBody:joi.string().required(),
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
}
export const updatePost = {
    params:joi.object().required().keys({
        id:joi.string().required(),
    }),
    body:joi.object().required().keys({
        postBody:joi.string().required(),
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
}
export const getAllPosts = {
    query:joi.object().keys({
        page:joi.number(),
        size:joi.number()
    })
}
export const getSpecificPosts = {
    params:joi.object().required().keys({
        id:joi.string().required(),
    }),
    query:joi.object().keys({
        page:joi.number(),
        size:joi.number()
    })
}