

function toggleDone() {
  $(this).parent().parent().toggleClass("success");
  updateCounters();
}

function updateCounters() {
  $("#total-count").html($(".todo").size());
  $("#completed-count").html($(".success").size());
  $("#todo-count").html($(".todo").size() - $(".success").size());
}

function nextTodoId() {
  return $(".todo").size() + 1;
}

function createTodo(title) {
  var checkboxId = "todo-" + nextTodoId();

  var label = $('<label></label>')
    .attr('for', checkboxId)
    .html(title);

  var checkbox = $('<input type="checkbox" value="1" />')
    .attr('id', checkboxId)
    .bind('change', toggleDone);

  var tableRow = $('<tr class="todo"></td>')
    .append($('<td>').append(checkbox))
    .append($('<td>').append(label));

  $("#todoList").append( tableRow );

  updateCounters();

  var newTodo = { title: title, completed: false };

  $.ajax({
    type: "POST",
    url: "/todos.json",
    data: JSON.stringify({
      todo: newTodo
    }),
    contentType: "application/json",
    dataType: "json" })

    .fail(function(error) {
      console.log(error);

      error_message = error.responseJSON.title[0];
      showError(error_message);
    });
}

function showError(message) {
  var errorHelpBlock = $('<span class="help-block"></span>')
  .attr('id', 'error_message')
  .text(message);

  $("#formgroup-title")
  .addClass("has-error")
  .append(errorHelpBlock);

}

function submitTodo(event) {
  event.preventDefault();
  createTodo($("#todo_title").val());
  $("#todo_title").val(null);
  updateCounters();
}

function cleanUpDoneTodos(event) {
  event.preventDefault();
  $.when($(".success").remove())
    .then(updateCounters);
}

$(document).ready(function() {
  $("input[type=checkbox]").bind('change', toggleDone);
  $("form").bind('submit', submitTodo);
  $("#clean-up").bind('click', cleanUpDoneTodos);
  updateCounters();
});
