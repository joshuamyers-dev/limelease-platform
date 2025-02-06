defmodule LimeLease.Task.Task do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "tasks" do
    field :name, :string
    field :frequency_months, :integer
    field :type, Ecto.Enum, values: ~w(compliance safety routine)a

    has_many :property_tasks, LimeLease.PropertyTask.PropertyTask
  end

  def create_changeset(task, attrs) do
    task
    |> cast(attrs, [:name, :frequency_months, :type])
    |> validate_required([:name, :frequency_months, :type])
  end
end
