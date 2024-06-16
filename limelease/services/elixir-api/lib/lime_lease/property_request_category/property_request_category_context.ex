defmodule LimeLease.PropertyRequestCategory.PropertyRequestCategoryContext do
  @moduledoc false
  alias LimeLease.PropertyRequestCategory.PropertyRequestCategory

  alias LimeLease.Repo

  def get_categories() do
    Repo.all(PropertyRequestCategory)
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
