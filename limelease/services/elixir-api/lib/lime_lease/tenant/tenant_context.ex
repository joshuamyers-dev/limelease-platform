defmodule LimeLease.Tenant.TenantContext do
  alias LimeLease.Tenant.Tenant
  @moduledoc false

  alias LimeLease.Repo

  def get_tenant_by_phone_number(number) do
    Tenant
    |> Tenant.with_phone_number(number)
    |> Tenant.default_preloads()
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
