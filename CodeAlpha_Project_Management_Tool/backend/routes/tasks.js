const express = require('express');
const { authenticate } = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const { emitNotification } = require('../socket/index'); 

const router = express.Router();

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignee, projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can create tasks' });
    }

    const task = new Task({
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      assignee: assignee || null,
      project: projectId,
      createdBy: req.user._id,
    });
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignee', 'username email')
      .populate('createdBy', 'username email');


    if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
      const { emitNotification } = require('../socket');
      emitNotification(
        task.assignee.toString(),
        `You have been assigned to task "${task.title}" in project "${project.name}"`
      );
    }

    res.status(201).json({ task: populated });
  } catch (err) {
    next(err);
  }
});


router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can edit tasks' });
    }

    const { title, description, status, priority, dueDate, assignee } = req.body;
    const oldAssignee = task.assignee ? task.assignee.toString() : null;
    const newAssignee = assignee || null;

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.assignee = newAssignee;
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignee', 'username email')
      .populate('createdBy', 'username email');


    if (newAssignee && newAssignee !== oldAssignee && newAssignee !== req.user._id.toString()) {
      emitNotification(
        newAssignee,
        `You have been assigned to task "${task.title}" in project "${project.name}"`
      );
    }

    res.json({ task: populated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });


    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can delete tasks' });
    }

    await Comment.deleteMany({ task: task._id });
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/move', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Todo', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });


    if (!project.members.some(m => m.toString() === req.user._id.toString()) &&
        project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not a member of this project' });
    }

    task.status = status;
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignee', 'username email')
      .populate('createdBy', 'username email');


    res.json({ task: populated });
  } catch (err) {
    next(err);
  }
});


router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'username email')
      .populate('createdBy', 'username email')
      .populate('project', 'name');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project._id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.members.some(m => m.toString() === req.user._id.toString()) &&
        project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not a member of this project' });
    }

    const comments = await Comment.find({ task: task._id })
      .populate('author', 'username email')
      .sort({ createdAt: 1 });

    res.json({ task, comments });
  } catch (err) {
    next(err);
  }
});

module.exports = router;