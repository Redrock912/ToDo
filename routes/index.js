var express = require("express");
var router = express.Router();
var fs = require("fs");
var app = express();

var task = [];

fs.exists("./taskList.json", function(exists) {
  if (exists) {
    fs.readFile(
      "./taskList.json",
      {
        encoding: "utf8"
      },
      function(err, taskList) {
        console.log(taskList);
        //task = JSON.parse(taskList).taskList;

        console.log(task);
      }
    );
  }
});

router.post("/addtask", function(req, res) {
  var newTaskText = req.body.newTask;
  var newTaskDate = req.body.dueDate;
  var newTaskPriority = req.body.priority;

  if (newTaskText != "") {
    if (newTaskDate == "") {
      newTaskDate = "1";
    }
    task.push({
      text: newTaskText,
      date: newTaskDate,
      priority: newTaskPriority
    });
  }

  res.redirect("/");
});

var complete = ["Kill Hogger"];

router.post("/removetask", function(req, res) {
  var completeTask = req.body.check;

  if (typeof completeTask === "string") {
    complete.push(completeTask);

    task.splice(task.indexOf(completeTask), 1);
  } else if (typeof completeTask === "object") {
    for (var i = 0; i < completeTask.length; i++) {
      complete.push(completeTask[i]);
      task.splice(task.indexOf(completeTask[i]), 1);
    }
  }

  res.redirect("/");
});

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "ToDo LIST!!!",
    task: task,
    complete: complete
  });
});

module.exports = router;
