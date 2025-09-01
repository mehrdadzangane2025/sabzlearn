const yup = require("yup");

const { object, string, number, ref } = yup;

let userSchema = object({
    username: string().required(),
    name: string().required(),
    email: string().required(),
    phone: number().required().positive().integer(),
    password: string()
        .required()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: string()
        .required()
        .oneOf([ref("password")], "Passwords must match"),
});



module.exports = userSchema;