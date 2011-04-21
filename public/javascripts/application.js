// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

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
      tmplItem.tmpl = $.template("todo_item");
      tmplItem.data = updatedTodo;
      tmplItem.update();
      detailTmplItem = $("#todo_detail").tmplItem();
      detailTmplItem.data = updatedTodo;
      detailTmplItem.update();
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
      tmplItem.data = todo;
      tmplItem.tmpl = $.template("todo_item");
      tmplItem.update();
    });
  });
  
  // show detail view when an item is clicked
  $("#todo_list li a").live("click", function(evt) {
    $("#todo_detail_container").html('');
    $.tmpl("todo_detail", $(this).tmplItem().data).appendTo("#todo_detail_container");
    return false;
  });
});