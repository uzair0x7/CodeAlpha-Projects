const express = require('express');
const { authenticate } = require('../middleware/auth');
const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');

const router = express.Router();

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { text, taskId } = req.body;
    if (!text.trim()) return res.status(400).json({ message: 'Comment text required' });
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.members.some(m => m.toString() === req.user._id.toString()) &&
      project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not a member' });
    }
    const comment = new Comment({
      text,
      task: taskId,
      author: req.user._id,
    });
    await comment.save();
    const populated = await Comment.findById(comment._id)
      .populate('author', 'username email');
    res.status(201).json({ comment: populated });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });


    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the author can edit this comment' });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    comment.text = text.trim();
    await comment.save();

    const populated = await Comment.findById(comment._id)
      .populate('author', 'username email');

    res.json({ comment: populated });
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });


    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the author can delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;