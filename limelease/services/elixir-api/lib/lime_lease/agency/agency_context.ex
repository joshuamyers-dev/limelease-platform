defmodule LimeLease.Agency.AgencyContext do
  @moduledoc false
  alias LimeLease.Agency.Agency

  alias LimeLease.Repo

  def get_agency_by_id(id) do
    Repo.get(Agency, id)
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
