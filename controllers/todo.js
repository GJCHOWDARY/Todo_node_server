const User = require("../models/user"),
      Todo = require("../models/todo");

var Todos={}

Todos.saveTodo = async (req, res, next) => {
  try { 
    console.log(req.body)
    var newTodo = new Todo({
                  title: req.body.title,
                  description: req.body.description,
                  userId:req.userId
                });

    var saveTodo=await newTodo.save();
     if (saveTodo) {
      res.status(200).json({
        status: true,
        message: 'Successfully Created!'
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

Todos.getTodos = async (req, res, next) => {
  try {
  const search = req.query.search;
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  var where={}

  if (search) {
    where.title={$regex: search, $options: 'i'}
     }

     var todoQuery = Todo.find(where)
                       .populate('userId', 'name')

    if (pageSize && currentPage) {
      todoQuery.select('_id title description userId createdAt')
                .skip(pageSize * (currentPage - 1)).limit(pageSize)
                .sort({createdAt: 'desc'}).exec;
    }
    var todo = await todoQuery;
    var todoCount= await Todo.countDocuments();
    if (todo) {
      console.log(todo)
      res.status(200).json({
        status: true,
        data: todo,
        count: todoCount
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

Todos.getTodoById = (req, res, next) => {
  var where={}
    where._id= req.params.id;
    where.userId=req.userId;

  const postQuery = Todo.find(where)
    .then(todoDoc => {
      if (todoDoc.length>0) {
        res.status(200).json({
          message: "fetched successfully!",
          data: todoDoc
        })
      }else {
        res.status(404).json({
        message: "Todo Not Found!"
      })
      }
   })
    .catch(error => {
      if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    });
}

Todos.updateTodo = async (req, res, next) => {
  try {
    const group = {
        _id: req.body.id,
        title: req.body.title,
        description: req.body.description
    };
    var updateTodo = await Todo.updateOne({ _id: req.params.id}, group);
    if (updateTodo) {
      res.status(200).json({
        status: true,
        message: 'Successfully Updated!'
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

Todos.deleteTodo = async (req, res, next) => {
  try {
    var todo = await Todo.deleteOne({ _id: req.params.id});
    if (todo) {
      res.status(200).json({
        status: true,
        data: 'Successfully Deleted!'
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

module.exports=Todos;
