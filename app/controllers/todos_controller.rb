class TodosController < ApplicationController
  respond_to :json

  def index
    respond_with Todo.all
  end

  def create
    @todo = Todo.new(params[:todo])
    if @todo.save
      respond_with @todo
    else
      render :text => "ERROR", :status => 500
    end
  end

  def update
    @todo = Todo.find(params[:id])

    # clear updated_at coming from the request
    params[:todo].delete(:updated_at)

    if @todo.update_attributes(params[:todo])
      render :text => @todo.to_json
    else
      render :text => "ERROR", :status => 500
    end
  end
end
