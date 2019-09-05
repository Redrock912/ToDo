


$(document).ready(function(){
    $.ajax('/deploy', {
        'success': function(taskList){
            var tableRow ='';

            console.log("qwer");
            console.log(taskList);
            taskList = JSON.parse(taskList).taskList;
            
            

            for(var i=0; i< taskList.length; i++){
                tableRow+=   '<tr>' +
							'<td><button>완료</button></td>' + 
                            '<td>'+ taskList[i].text + '</td>' + 
                            '<td>'+ taskList[i].date +'</td>' + 
                            '<td>'+ taskList[i].priority +'</td>' + 
						'</tr>';
            }

            $('tbody').html(tableRow);
        }
    })
})