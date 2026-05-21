const AuthController = require("../controllers/AuthController");
const TaskController = require("../controllers/TaskController");
const auth = require("../middlewares/auth");

const express = require("express");
const authorization  = require("../middlewares/authorization");

const router = express.Router();

// auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// protected routes (must logged in)
router.use(auth);
// task
router.get("/tasks", TaskController.getMyTasks);
router.post("/tasks", TaskController.createTask);

// user can't disturb other users task (authz middleware)
router.get("/task/:id", authorization, TaskController.getTaskById);
// user can toggle complete, edit title, desc, due dates, priority
router.patch("/task/:id", authorization, TaskController.updateTask);
router.delete("/task/:id", authorization, TaskController.deleteTask);

module.exports = router;
