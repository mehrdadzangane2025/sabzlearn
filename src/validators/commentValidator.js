const yup = require("yup");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const commentSchema = yup.object({
    body: yup.string().required("Body is required"),
    creator: yup
        .string()
        .matches(objectIdRegex, "Creator must be a valid ObjectId")
        .notRequired(),
    course: yup
        .string()
        .nullable(),
    article: yup
        .string()
        .matches(objectIdRegex, "Article must be a valid ObjectId")
        .nullable(),
    score: yup
        .number()
        .nullable()
        .notRequired()
        .min(1, "Score must be at least 1")
        .max(5, "Score cannot be more than 5"),
    isAccept: yup.boolean().nullable(),
    isAnswer: yup.boolean().nullable(),
}).test(
    'at-least-one',
    'Either course or article must be provided',
    (obj) => obj.course || obj.article
);

module.exports = commentSchema;