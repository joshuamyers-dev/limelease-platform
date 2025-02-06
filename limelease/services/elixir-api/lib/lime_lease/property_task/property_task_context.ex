defmodule LimeLease.PropertyTask.PropertyTaskContext do
  @moduledoc false
  alias LimeLease.PropertyTask.PropertyTask
  alias LimeLease.Repo

  require IEx

  def get_tasks() do
    PropertyTask
    |> Repo.all()
    |> Repo.ok_error()
  end

  def get_property_task_by_id(id) do
    PropertyTask
    |> PropertyTask.with_id(id)
    |> Repo.one()
    |> Repo.ok_error()
  end

  def get_all_property_tasks_for_property(property_id) do
    PropertyTask
    |> PropertyTask.with_property_id(property_id)
    |> PropertyTask.default_preloads()
    |> Repo.all()
    |> Repo.ok_error()
  end

  def get_property_tasks_for_property(property_id) do
    PropertyTask
    |> PropertyTask.with_property_id(property_id)
    |> PropertyTask.with_due_date_within_next_year()
    |> PropertyTask.with_not_completed()
    |> PropertyTask.sorted_by_due_date()
    |> PropertyTask.default_preloads()
    |> Repo.all()
    |> Repo.ok_error()
  end

  def create_property_task(attrs) do
    due_date = DateTime.utc_now() |> DateTime.add(attrs.task.frequency_months * 30 * 24 * 60 * 60, :second)

    %PropertyTask{}
    |> PropertyTask.create_changeset(Map.put(attrs, :due_date, due_date))
    |> Repo.insert()
    |> Repo.ok_error()
  end

  def update_property_task(property_task, attrs) do
    property_task
    |> PropertyTask.update_changeset(attrs)
    |> Repo.update()
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
