const AuthController = require("../controllers/AuthController");
const TaskController = require("../controllers/TaskController");
const auth = require("../middlewares/auth");

const express = require("express");
const { authorization } = require("../middlewares/authorization");

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
router.use(authorization);
router.get("/task/:id", TaskController.getTaskById);
// user can toggle complete, edit title, desc, due dates, priority
router.patch("/task/:id", TaskController.updateTask);
router.delete("/task/:id", TaskController.deleteTask);

module.exports = router;
