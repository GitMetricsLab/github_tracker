const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: result.error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        });
    }

    req.validated = result.data;
    req.body = result.data;
    next();
}

module.exports = { validateRequest };