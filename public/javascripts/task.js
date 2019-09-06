function setPriorityText(val) {
  var text;
  switch (val) {
    case "1":
      text = "ASAP";
      break;
    case "2":
      text = "Ordinary";
      break;
    case "3":
      text = "take it slow";
      break;
  }

  return text;
}

function alertOverdueTask(val) {
  alert("there are " + val + " task(s) overdue!! ");
}

$(document).ready(function() {
  var getList = function() {
    $.ajax("/deploy", {
      success: function(taskList) {
        var tableRow = "";
        taskList = JSON.parse(taskList).taskList;

        var alertIndex = 0;
        var date = new Date().getTime();
        for (var i = 0; i < taskList.length; i++) {
          if (taskList[i].realDate < date) {
            alertIndex++;
          }
          tableRow +=
            "<tr>" +
            '<td style="visibility: hidden">' +
            (i + 1) +
            "</td>" +
            '<td><button type="button" class="completeButton">Done</button></td>' +
            "<td>" +
            taskList[i].text +
            "</td>" +
            "<td>" +
            taskList[i].date +
            "</td>" +
            "<td>" +
            setPriorityText(taskList[i].priority) +
            "</td>" +
            '<td><button type="button" class="editButton">Edit</button></td>' +
            '<td><button type="button" class="deleteButton">Delete</button></td>' +
            "</tr>";
        }

        if (alertIndex > 0) {
          alertOverdueTask(alertIndex);
        }

        $(".currentTaskTable").html(tableRow);
      }
    });
  };

  var getArchiveList = function() {
    $.ajax("/archiveTask", {
      success: function(archiveList) {
        var tableRow = "";
        archiveList = JSON.parse(archiveList).archiveList;

        for (var i = 0; i < archiveList.length; i++) {
          tableRow += "<tr>" + "<td>" + archiveList[i].text + "</td>" + "</tr>";
        }

        $(".archiveTaskTable").html(tableRow);
      }
    });
  };

  getList();
  getArchiveList();

  function refreshList() {
    getList();
    getArchiveList();
  }

  $(".currentTaskTable").on("click", ".completeButton", function() {
    $.ajax("/completeTask", {
      method: "POST",
      data: {
        index:
          parseInt(
            $(this)
              .parent()
              .siblings()
              .first()
              .text()
          ) - 1
      },
      success: refreshList
    });
  });

  $(".currentTaskTable").on("click", ".deleteButton", function() {
    $.ajax("/deleteTask", {
      method: "POST",
      data: {
        index:
          parseInt(
            $(this)
              .parent()
              .siblings()
              .first()
              .text()
          ) - 1
      },
      success: getList
    });
  });

  $(".currentTaskTable").on("click", ".editButton", function() {
    var modalForm = $("#id01")[0];
    modalForm.style.display = "block";

    $.ajax("/editTask", {
      method: "POST",
      data: {
        index:
          parseInt(
            $(this)
              .parent()
              .siblings()
              .first()
              .text()
          ) - 1 // 선택한 행의 인덱스
      },
      success: getList
    });
  });

  $(".sort").click(function() {
    $.ajax("/sortTask", {
      method: "POST",
      data: {
        index: 1
      },
      success: getList
    });
  });
});
