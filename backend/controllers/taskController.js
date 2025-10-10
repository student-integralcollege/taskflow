import task from '../models/taskModel.js';

export const createTask = async (req, res) => {
    try {
        const { title, description, priority, duedate, completed } = req.body;
        const newTask = new task({
            title,
            description,
            priority,
            duedate,
            completed: completed === 'yes' || completed === true,
            owner: req.user.id
        });
        const saved = await newTask.save();
        res.status(201).json({
            success: true,
            task: saved
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// get all tasked for logged - in user

export const getTasks = async (req, res) => {
    try {
        const tasks = await task.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// get single task by id (must belong to particular user)

export const getTaskById = async (req, res) => {
    try {
        const Task = await task.findOne({ _id: req.params.id, owner: req.user.id });
        if (!Task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        res.status(200).json({
            success: true,
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// update a task 

export const updateTask = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.completed !== undefined) {
            data.completed = data.completed === 'yes' || data.completed === true;
        }
        const updated = await task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            data,
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        res.status(200).json({
            success: true,
            task: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// delete a task
export const deleteTask = async (req, res) => {
    try {
        const deleted = await task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};