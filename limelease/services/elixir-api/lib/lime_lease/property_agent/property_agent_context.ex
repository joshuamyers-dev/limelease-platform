defmodule LimeLease.PropertyAgent.PropertyAgentContext do
  @moduledoc false

  alias LimeLease.User.User
  alias LimeLease.PropertyAgent.PropertyAgent
  alias LimeLease.Property.Property
  alias LimeLease.AgencyAgent.AgencyAgent

  alias LimeLease.Repo

  require IEx

  def get_managed_property_ids_for_agent(%AgencyAgent{} = agent) do
    PropertyAgent
    |> PropertyAgent.with_agent_id(agent.id)
    |> PropertyAgent.select_property_id()
    |> Repo.all()
    |> Repo.ok_error()
  end

  def get_manager_user_ids_for_property(%Property{} = property) do
    PropertyAgent
    |> PropertyAgent.with_property_id(property.id)
    |> PropertyAgent.select_user_id_for_property_agent()
    |> Repo.all()
    |> Repo.ok_error()
  end
end
