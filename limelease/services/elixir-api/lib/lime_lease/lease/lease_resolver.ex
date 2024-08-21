defmodule LimeLease.Lease.LeaseResolver do
  alias LimeLease.Lease.{Lease, LeaseService}

  alias LimeLease.Repo

  def lease_is_active_field(%Lease{} = lease, _args, %{context: %{current_user: user}}) do
    lease =
      case Ecto.assoc_loaded?(lease.property) do
        true -> lease
        false ->
          Repo.preload(lease, [property: :tenants])
      end

    case Enum.empty?(lease.property.tenants) do
      true ->
        {:ok, false}
      false ->
        {:ok, true}
    end
  end

  def my_lease_query(_parent, args, %{context: %{current_user: user}}) do
    LeaseService.get_lease_for_user(user)
  end
end
