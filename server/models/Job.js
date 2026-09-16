const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true
        },
        status: {
            type: String,
            enum: ['applied','interview','offer','rejected'],
            default: 'applied'
        },
        location: {
            type: String,
            trim: true,
            default: ''
        },
        url: {
            type: String,
            trim: true,
            default: ''
        },
        notes: {
            type: String,
            default: '',
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Job", jobSchema);