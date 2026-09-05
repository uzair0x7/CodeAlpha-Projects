const express = require('express');
const { authenticate } = require('../middleware/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    })
      .populate('owner', 'username email')
      .populate('members', 'username email');
    res.json({ projects });
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });
    await project.save();
    const populated = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');
    res.status(201).json({ project: populated });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('members', 'username email');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.members.some(m => m._id.toString() === req.user._id.toString()) &&
      project.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const tasks = await Task.find({ project: project._id })
      .populate('assignee', 'username email')
      .populate('createdBy', 'username email');
    res.json({ project, tasks });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can update' });
    }
    const { name, description } = req.body;
    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    await project.save();
    const populated = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');
    res.json({ project: populated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can delete' });
    }
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;