defmodule LimeLease.Lease.LeaseContext do
  @moduledoc false

  alias LimeLease.Lease.Lease
  alias LimeLease.Property.Property

  alias LimeLease.Repo

  def get_lease_for_property_id(property_id) do
    Lease
    |> Lease.with_property_id(property_id)
    |> Repo.one()
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
