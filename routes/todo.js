const express = require("express"),
      TodoController = require("../controllers/todo");

const router = express.Router();

 
router.post("/", TodoController.saveTodo);

router.get("/", TodoController.getTodos);

router.get("/:id", TodoController.getTodoById);

router.put("/:id", TodoController.updateTodo);

router.delete("/:id", TodoController.deleteTodo);

module.exports = router;