const { z } = require("zod");

const signupSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters long")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
        .trim(),
    
    email: z.string()
        .email("Invalid email address")
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must be at most 100 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain uppercase, lowercase, number, and special character'
        ),
});


const loginSchema = z.object({
    email: z.string()
        .email("Invalid email address")
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must be at most 100 characters long")
});


module.exports = { signupSchema, loginSchema };