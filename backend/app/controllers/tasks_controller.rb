class TasksController < ApplicationController
  # タスク一覧を取得
  def index
    tasks = Task.all
    render json: tasks
  end

  # 特定のタスクを取得
  def show
    task = Task.find(params[:id])
    render json: task
  end

  # タスクを作成
  def create
    task = Task.new(task_params)
    if task.save
      render json: task, status: :created
    else
      render json: task.errors, status: :unprocessable_entity
    end
  end

  # タスクを更新
  def update
    task = Task.find(params[:id])
    if task.update(task_params)
      render json: task
    else
      render json: task.errors, status: :unprocessable_entity
    end
  end

  # タスクを削除
  def destroy
    task = Task.find(params[:id])
    task.destroy
    head :no_content
  end

  private

  # 強いパラメータ
  def task_params
    params.require(:task).permit(:title, :description, :completed)
  end
end