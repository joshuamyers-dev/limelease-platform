defmodule LimeLease.Lease.LeaseService do
  alias LimeLease.Lease.{Lease, LeaseContext}
  alias LimeLease.User.User

  def get_lease_for_user(%User{} = user) do
    with true <- user.tenant != nil do
      LeaseContext.get_lease_for_property_id(user.tenant.property_id)
    else
      _ ->
        {:ok, nil}
    end
  end
end
