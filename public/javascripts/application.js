$(function() {
  
  // compile the templates
  $.template("new_todo_form", $('#tmpl_new_todo_form'));
  $.template("update_todo_form", $('#tmpl_update_todo_form'));
  $.template("todo_item", $('#tmpl_todo_item'));
  $.template("todo_detail", $('#tmpl_todo_item_detail'));
  
  // render the new todo form
  $.tmpl("new_todo_form").appendTo("#todo_form");

  // populate the todo item list
  $.get('/todos.json', function(data) {
    $.tmpl("todo_item", data).appendTo("#todo_list");
  })

  // handle the click event on the checkboxes
  $('#todo_list li :checkbox').live('click', function() {
    var done = $(this).is(':checked')
      , tmplItem = $(this).tmplItem()
      , tmplData = tmplItem.data;
      
    tmplData.todo.is_done = done;
    
    var payload = {'_method': 'put'};
    $.extend(true, payload, tmplData);
      
    $.post('/todos/'+tmplData.todo.id, payload, function(updatedTodo) {
      $('body').trigger('todoUpdated', [updatedTodo, tmplItem]);
    }, "json");
  });
  
  $('form').bind('ajax:success', function(evt, todo) {
    $(this).find('input[type=text]').val('');
    $("#tmpl_todo_item").tmpl(todo).prependTo($("#todo_list"));
  });
  
  $("#todo_list li label").live("dblclick", function() {
    var tmplItem = $(this).tmplItem();
    tmplItem.tmpl = $.template("update_todo_form");
    tmplItem.update();
    var form = tmplItem.nodes[0];
    $(form).find('input[type=text]').select();
    $(form).find('a').click(function() {
      tmplItem.tmpl = $.template("todo_item");
      tmplItem.update();
    });
    $(form).bind('ajax:success', function(evt, todo) {
      $('body').trigger('todoUpdated', [todo, tmplItem]);
    });
  });
  
  // show detail view when an item is clicked
  $("#todo_list li a").live("click", function(evt) {
    $("#todo_detail_container").html('');
    $.tmpl("todo_detail", $(this).tmplItem().data).appendTo("#todo_detail_container");
    return false;
  });
  
  // update the UI when a todo is updated
  $('body').bind('todoUpdated', function(evt, todo, tmplItem) {
    // update the item in the list
    tmplItem.data = todo;
    tmplItem.tmpl = $.template("todo_item");
    tmplItem.update();
    
    // update the detail view
    var detailTmplItem = $("#todo_detail").tmplItem();
    detailTmplItem.data = todo;
    detailTmplItem.update();
  });
});

// date formatter helper function
function formatDate(dateString) {
  var distInSecs = parseInt((new Date() - new Date(dateString)) / 1000)
    , minutes = parseInt(distInSecs / 60)
    , seconds = distInSecs - 60 * minutes
    , str = "";
  
  if (minutes) str = str + minutes +  " min, ";
  str = str + seconds + " sec ago";
  return str;
}