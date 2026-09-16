const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../middleware/validate');
const {registerUserSchema, loginUserSchema} = require('../schemas/userSchema');

const router = express.Router();

//REGISTER USER
router.post('/register', validate(registerUserSchema), async(req, res) => {
    try {
        const {name, email, password} = req.body;

        const existing = await User.findOne({email})
        if (existing) {
            return res.status(400).json({
                error: 'Email already exists',
            })
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({name, email, password: hashed})

        const token = jwt.sign(
            {
                userId: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            }
        )

        res.status(200).json({
            token,
            user: {id: user._id, name: user.name, email: user.email}
        })
    }catch(err) {
        res.status(500).json({error: err.message})
    }
})

//LOGIN
router.post('/login', validate(loginUserSchema), async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user) {
            return res.status(401).json({
                error: 'Invalid email'
            })
        }
        const match = await bcrypt.compare(password, user.password)
        if(!match) {
            return res.status(401).json({
                error: 'Incorrect password',
            })
        }
        
        const token = jwt.sign(
            {
                userId: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            }
        )
        res.json({
            token,
            user: {id: user._id, name: user.name, email: user.email}
        })
    }catch(err) {
        res.status(500).json({error: err.message})
    }
})

module.exports = router;