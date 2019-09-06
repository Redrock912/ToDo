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

$(document).ready(function() {
  var getList = function() {
    $.ajax("/deploy", {
      success: function(taskList) {
        var tableRow = "";
        taskList = JSON.parse(taskList).taskList;

        for (var i = 0; i < taskList.length; i++) {
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
            "</tr>";
        }

        $("tbody").html(tableRow);
      }
    });
  };

  getList();

  $("tbody").on("click", ".completeButton", function() {
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
          ) - 1 // 선택한 행의 인덱스
      },
      success: getList
    });
  });

  $("tbody").on("click", ".editButton", function() {
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
