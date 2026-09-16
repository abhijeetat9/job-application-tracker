const {z} = require('zod');

const registerUserSchema = z.object({
    name: z.string().min(2,"Name should be at least 3 characters").trim(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6,"Password should be at least 6 characters"),
})

const loginUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1,"Password is required"),
})

module.exports = {registerUserSchema, loginUserSchema}