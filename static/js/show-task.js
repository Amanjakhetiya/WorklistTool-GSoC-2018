var tasks;
var worklist_name;
var worklist_created_by;
var input;
var rowsPerPageIndices;

function populateModal(task) {
    $('#exampleModalLongTitle').html(task.article_name);
    $('#task_progress').val(task.progress);
    $('input:radio[name=status][value='+task.status +']').prop("checked",true);
}

function taskForm(taskIndex){
    var task = tasks[taskIndex];
    populateModal(task);
    $('#exampleModalCenter').modal();
}

function saveTask() {
    $.ajax({url: "/worklist-tool/update-task-info/",
        type: "post",
        data: {
            'worklist_name': worklist_name,
            'worklist_created_by': worklist_created_by,
            'article_name': $('#exampleModalLongTitle').html(),
            'status': $('input:radio[name=status]:checked').val(),
            'progress': $('#task_progress').val(),
        },
        success: function (data) {
            window.location.reload(true);
        },
        error: function () {
            $("#alert-message-holder").html(
                "<div class='alert alert-danger' role='alert'><a href='#' class='close' " +
                "data-dismiss='alert'>&times;</a> " +
                "<strong>Oh snap!</strong>Something went wrong while" +
                " saving updated information! Please report Megha " +
                "at meghasharma4910@gmail.com</div>"
            );
    }});
}

function rememberState() {
        // Finding how many rows are being displayed so that we can make it same after refresh
        var rowsPerPageDropdownIndex = $('.page-list .dropdown-menu .dropdown-item.active').index();

        // Finding which page is active so that we can make it active again after refresh
        rowsPerPageIndex = $('.pagination .page-item.active').index();

        return {'rowsPerPageDropdownIndex': rowsPerPageDropdownIndex,
                'rowsPerPageIndex': rowsPerPageIndex
        }
}

function restoreState() {
      // making the number of rows to be same
      var dropdownElements = $('.page-list .dropdown-menu .dropdown-item');
      dropdownElements[rowsPerPageIndices.rowsPerPageDropdownIndex].click();

      // making the same page active as was before
      var paginationElements = $('.pagination .page-item .page-link');
      paginationElements[rowsPerPageIndices.rowsPerPageIndex].click();
}


function refresh() {
    search_term = $("#search_by_task_name_form input[name=search_term]").val();
    worklist_name = $("#search_by_task_name_form input[name=worklist_name]").val();
    worklist_created_by = $("#search_by_task_name_form input[name=worklist_created_by]").val();

    rowsPerPageIndices = rememberState();

    $('#task_table').load(
        "/worklist-tool/update-task-table/" + encodeURIComponent(worklist_created_by) + "/" + encodeURIComponent(worklist_name) + "?search_term=" + encodeURIComponent(search_term), function(){
            $('#task_table').hide();
            setTimeout(function(){$('#task_table').fadeIn('slow');},0);
        });
}

function worker() {
    refresh();
    setTimeout(worker, 50000);
}

function addArticle(worklist_name, worklist_created_by) {
    $.ajax({
        url: "/worklist-tool/add-articles-to-worklistt",
        type: "post",
        data: {
            article_name: $('#article_name').val(),
            article_description: $('#article_description').val(),
            article_effort: $('#article_effort').val(),
            worklist_created_by: worklist_created_by,
            worklist_name: worklist_name
        },
        success: function (data) {
            $("#add_articles_modal").modal("hide")
            $("#alert-message-holder").html(
                "<div class='alert alert-danger' role='alert'>" +
                "<a href='#' class='close' data-dismiss='alert'>&times;</a> "
                + data.message + "</div>"
            );
            if (data.error == 0) {
                refresh();
            }
        },
        error: function () {
            $("#alert-message-holder").html(
                "<div class='alert alert-danger' role='alert'><a href='#' class='close' " +
                "data-dismiss='alert'>&times;</a> " +
                "<strong>Oh snap!</strong>Something went wrong while" +
                " saving updated information! Please report at " +
                "https://github.com/MeghaSharma21/WorklistTool-GSoC-2018/issues</div>"
            );
    }});

    return false;
}

