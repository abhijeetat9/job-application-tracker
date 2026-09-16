const {z} = require('zod');

const createJobSchema = z.object({
    company: z.string().min(1, 'Company name is required').trim(),
    role: z.string().min(1, 'Role is required').trim(),
    status: z.enum(['applied', 'interview', 'offer', 'rejected']).default('applied'),
    location: z.string().trim().optional().default(''),
    url: z.string().trim().optional().default(''),
    notes: z.string().optional().default(''),
    appliedAt: z.string().optional()
});

const updateJobSchema = createJobSchema.partial();

module.exports = {createJobSchema, updateJobSchema};