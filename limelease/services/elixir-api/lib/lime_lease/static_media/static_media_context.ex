defmodule LimeLease.StaticMedia.StaticMediaContext do
  @moduledoc false

  alias LimeLease.StaticMedia.StaticMedia

  alias LimeLease.Repo

  def create_static_media(attrs \\ %{}) do
    %StaticMedia{}
    |> StaticMedia.changeset(attrs)
    |> Repo.insert()
  end

  # Dataloader functions
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
