const express = require('express');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createJobSchema, updateJobSchema } = require('../schemas/jobSchema');

const router = express.Router();

router.use(authMiddleware);

//Get All jobs 
router.get('/', async (req, res) => {
    try{
        const {status, search} = req.query;
        const filter = {userId: req.userId}
        
        if(status) filter.status = status;
        if(search){
            filter.$or = [
                {company: {$regex: search, $options: 'i'}},
                {role: {$regex: search, $options: 'i'}}
            ]
        }
        
        const jobs = await Job.find(filter).sort({appliedAt : -1});
        res.json(jobs)
    }catch(err){
        res.status(500).send({error: err.message})
    }
});

//Get stats

router.get('/stats', async (req, res) => {
    try{
        const userId = req.userId;
        
        const [total, interview, offer, rejected] = await Promise.all([
            Job.countDocuments({userId}),
            Job.countDocuments({userId, status: 'interview'}),
            Job.countDocuments({userId, status: 'offer'}),
            Job.countDocuments({userId, status: 'rejected'}),
        ])
        
        const interviewRate = total > 0 ? Math.round((interview/total) * 100) : 0;
        res.json({total, interview, offer, rejected, interviewRate});
    }catch(err){
        res.status(500).send({error: err.message})
    }
})

//Create job

router.post('/', validate(createJobSchema), async (req, res) => {
    try{
        const job = await Job.create({
            ...req.body,
            userId: req.userId,
        })
        res.status(201).json(job)
    }catch(err){
        res.status(400).send({error: err.message})
    }
})

//Update job

router.patch('/:id', validate(updateJobSchema), async (req, res) => {
    try{
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId},
            req.body,
            {new: true, runValidators: true}
        )
        
        if(!job) return res.status(404).json({error: 'Job not found'})
        res.json(job)
    }catch(err){
        res.status(400).send({error: err.message})
    }
})

//Delete job

router.delete('/:id', async (req, res) => {
    try{
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        })
        if(!job) return res.status(404).json({error: 'Job not found'})
        res.status(204).send();
    }catch(err){
        res.status(500).send({error: err.message})
    }
})

module.exports = router;