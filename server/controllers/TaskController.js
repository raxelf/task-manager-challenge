const { Task } = require("../models");

class TaskController {
  static async getMyTasks(req, res, next) {
    try {
      // get user id by payload (authenticated)
      const { id: userId } = req.authenticatedUser;

      const { sort, order } = req.query;
      let orderClause;

      if (sort) {
        const sortOrder =
          order && order.toUpperCase() === "DESC" ? "DESC" : "ASC";
        orderClause = [[sort, sortOrder]];
      } else {
        orderClause = [
          ["isCompleted", "ASC"], // not completed
          ["dueDate", "ASC"], // deadline
          ["priority", "DESC"], // high priority
          ["createdAt", "DESC"], // newest input
        ];
      }

      // get owned task by user id
      const myTasks = await Task.findAll({
        where: { userId },
        order: orderClause,
      });

      res.status(200).json({
        success: true,
        data: myTasks,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTaskById(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: req.task, // got from middleware authz
      });
    } catch (err) {
      next(err);
    }
  }

  static async createTask(req, res, next) {
    try {
      const { id: userId } = req.authenticatedUser;
      const { title, description, dueDate, priority } = req.body;

      const newTask = await Task.create({
        userId,
        title,
        description,
        dueDate,
        priority,
      });

      res.status(201).json({
        success: true,
        message: "Task successfully created.",
        data: newTask,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const { title, description, dueDate, priority, isCompleted } = req.body;

      await req.task.update({
        title,
        description,
        dueDate,
        priority,
        isCompleted,
      });

      res.status(200).json({
        success: true,
        message: "Task successfully updated.",
        data: req.task,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      // got from middleware authz to avoid redundancy
      await req.task.destroy();

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TaskController;
