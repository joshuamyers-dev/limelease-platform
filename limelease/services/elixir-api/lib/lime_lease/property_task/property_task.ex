defmodule LimeLease.PropertyTask.PropertyTask do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "property_tasks" do
    field :due_date, :utc_datetime_usec
    field :completed_at, :utc_datetime_usec
    field :completed, :boolean, default: false

    belongs_to :property, LimeLease.Property.Property, type: :binary_id
    belongs_to :task, LimeLease.Task.Task, type: :binary_id

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(property_task, attrs) do
    property_task
    |> cast(attrs, [:due_date, :completed_at, :completed])
    |> validate_required([:due_date])
    |> put_assoc(:property, attrs[:property])
    |> put_assoc(:task, attrs[:task])
    |> foreign_key_constraint(:property_id)
    |> foreign_key_constraint(:task_id)
  end

  def update_changeset(property_task, attrs) do
    property_task
    |> cast(attrs, [:due_date, :completed_at, :completed])
  end

 def default_preloads(query) do
    query
    |> preload(:task)
  end

  def with_id(query, id) do
    query
    |> where([q], q.id == ^id)
  end

  def with_property_id(query, property_id) do
    query
    |> where([q], q.property_id == ^property_id)
  end

  def with_task_id(query, task_id) do
    query
    |> where([q], q.task_id == ^task_id)
  end

  def with_future_due_date(query) do
    query
    |> where([q], q.due_date > ^DateTime.utc_now())
  end

  def with_due_date_within_next_year(query) do
    upcoming_date = DateTime.utc_now() |> DateTime.add(31_536_000, :second)

    query
    |> where([q], q.due_date > ^DateTime.utc_now())
    |> where([q], q.due_date < ^upcoming_date)
  end

  def with_not_completed(query) do
    query
    |> where([q], q.completed == false)
  end

  def sorted_by_due_date(query) do
    query
    |> order_by([q], asc: q.due_date)
  end
end
