var express = require("express");
var router = express.Router();
var fs = require("fs");
var app = express();

var task = [];

function realDueDate(index) {
  var currentDate = new Date();

  var dueDate = new Date(
    currentDate.getTime() + index * 24 * 60 * 60 * 1000
  ).getTime();

  return dueDate;
}

function showLeftDays(date) {
  var currentDate = new Date();

  return Math.ceil((date - currentDate) / 1000 / 60 / 60 / 24);
}

function updateFile(data) {
  fs.writeFile("./taskList.json", JSON.stringify(data), function(error) {
    if (error) {
      throw error;
    }
  });
}

router.get("/deploy", function(req, res) {
  fs.exists("./taskList.json", function(exists) {
    if (exists) {
      fs.readFile(
        "./taskList.json",
        {
          encoding: "utf8"
        },
        function(err, taskList) {
          var data = JSON.parse(taskList);
          task = data.taskList;

          for (var i = 0; i < task.length; i++) {
            task[i].date = showLeftDays(task[i].realDate);
          }

          data.taskList = task;

          updateFile(data);

          res.json(taskList);
        }
      );
    }
  });
});

router.post("/addtask", function(req, res) {
  var newTaskText = req.body.newTask;
  var newTaskDate = req.body.dueDate;
  var newTaskPriority = req.body.priority;
  var newTaskDueDate;

  if (newTaskText != "") {
    // check for null task
    if (newTaskDate == "") {
      newTaskDate = "1";
    }
    task.push({
      text: newTaskText,
      date: newTaskDate,
      priority: newTaskPriority,
      realDate: realDueDate(newTaskDate)
    });

    fs.readFile(
      "./taskList.json",
      {
        encoding: "utf8"
      },
      function(err, taskList) {
        var data = JSON.parse(taskList);

        data.taskList = task;

        updateFile(data);
      }
    );
  }

  res.redirect("/");
});

var complete = ["Kill Hogger"];

router.post("/completeTask", function(req, res) {
  fs.readFile(
    "./taskList.json",
    {
      encoding: "utf8"
    },
    function(error, taskList) {
      var data = JSON.parse(taskList);
      console.log(req.body.index);

      var finishedData = data.taskList[req.body.index];
      // completed tasks are moved to completeList.json
      fs.readFile(
        "./completeList.json",
        {
          encoding: "utf8"
        },
        function(error, completeData) {
          completeData = JSON.parse(completeData);

          completeData.completeList.push(finishedData);

          fs.writeFile(
            "./completeList.json",
            JSON.stringify(completeData),
            function(error) {
              if (error) {
                throw error;
              }
            }
          );
        }
      );

      data.taskList.splice(req.body.index, 1);

      updateFile(data);
    }
  );

  res.redirect("/");
});

var editIndex = -1;
router.post("/editTask", function(req, res) {
  // get index of task
  var index = req.body.index;
  if (typeof index == "string" || typeof index == "number") {
    editIndex = index;
  }

  var editTaskText = req.body.editTask;
  var editTaskDate = req.body.dueDate;
  var editTaskPriority = req.body.priority;

  if (editTaskText != undefined) {
    fs.readFile(
      "./taskList.json",
      {
        encoding: "utf8"
      },
      function(err, taskList) {
        var data = JSON.parse(taskList);

        task.splice(editIndex, 1, {
          text: editTaskText,
          date: editTaskDate,
          priority: editTaskPriority,
          realDate: realDueDate(editTaskDate)
        });

        data.taskList = task;

        updateFile(data);
      }
    );
  }

  res.redirect("/");
});

var sortIndex = 0;

router.post("/sortTask", function(req, res) {
  sortIndex = (sortIndex + parseInt(req.body.index)) % 2;

  // sort by due date , priority
  if (sortIndex == 0) {
    task.sort(function(a, b) {
      return a.date - b.date;
    });
  } else if (sortIndex == 1) {
    task.sort(function(a, b) {
      return a.priority - b.priority;
    });
  }

  fs.readFile(
    "./taskList.json",
    {
      encoding: "utf8"
    },
    function(err, taskList) {
      var data = JSON.parse(taskList);

      data.taskList = task;

      updateFile(data);
    }
  );

  res.redirect("/");
});

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
