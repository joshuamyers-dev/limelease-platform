defmodule LimeLease.PropertyAgent.PropertyAgentContext do
  @moduledoc false

  alias LimeLease.User.User
  alias LimeLease.PropertyAgent.PropertyAgent
  alias LimeLease.Property.Property

  alias LimeLease.Repo

  require IEx

  def get_managed_property_ids_for_user(%User{} = user) do
    PropertyAgent
    |> PropertyAgent.with_user_id(user.id)
    |> PropertyAgent.select_property_id()
    |> Repo.all()
    |> Repo.ok_error()
  end

  def get_manager_user_ids_for_property(%Property{} = property) do
    PropertyAgent
    |> PropertyAgent.with_property_id(property.id)
    |> PropertyAgent.select_user_id()
    |> Repo.all()
    |> Repo.ok_error()
  end
end
