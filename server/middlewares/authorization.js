const { Task } = require("../models");

const authorization = async (req, _res, next) => {
  const { id } = req.params;
  const { id: userId } = req.authenticatedUser;

  const task = await Task.findByPk(+id);
  if (!task || task.userId !== userId) throw new Error("TASK_NOT_FOUND");

  // forward the task to avoid redundancy.
  req.task = task;

  next();
};

module.exports = authorization;
