defmodule LimeLease.Task.TaskContext do
  @moduledoc false
  alias LimeLease.Task.Task

  alias LimeLease.Repo

  def get_tasks() do
    Task
    |> Repo.all()
    |> Repo.ok_error()
  end

  # Dataloader functions
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
