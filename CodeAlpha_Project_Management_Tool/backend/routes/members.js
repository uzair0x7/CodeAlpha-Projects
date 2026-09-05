const express = require('express');
const { authenticate } = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

const router = express.Router();

router.post('/:projectId', authenticate, async (req, res, next) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can add members' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'User already in project' });
    }
    project.members.push(user._id);
    await project.save();
    const populated = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');
    res.json({ project: populated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:projectId/:userId', authenticate, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can remove members' });
    }
    const userId = req.params.userId;
    if (userId === project.owner.toString()) {
      return res.status(400).json({ message: 'Cannot remove owner' });
    }
    project.members = project.members.filter(m => m.toString() !== userId);
    await project.save();
    const populated = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');
    res.json({ project: populated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;