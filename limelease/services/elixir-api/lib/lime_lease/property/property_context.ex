defmodule LimeLease.Property.PropertyContext do
  @moduledoc false

  alias LimeLease.Property.PropertyPhoto
  alias LimeLease.User.{User, UserContext}
  alias LimeLease.Property.Property
  alias LimeLease.PropertyAgent.PropertyAgentContext

  alias LimeLease.Repo

  import Ecto.Query

  require IEx

  def get_paginated_properties_for_user(%User{} = user, filter, search_keywords, pagination_args) do
    case UserContext.admin_of_agency?(user) do
      {:ok, :is_admin_of_agency} ->
        Property
        |> Property.with_agency_id(user.agency.id)

      {:error, :unauthorized} ->
        {:ok, property_ids} = PropertyAgentContext.get_managed_property_ids_for_agent(user.agency_agent)

        Property
        |> Property.with_id_in(property_ids)
    end
    |> Property.translate_filter_into_query(filter)
    |> Property.search_by_address(search_keywords)
    |> Property.order_by_inserted_date()
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, pagination_args)
  end

  def get_properties_by_ids(ids) do
    Property
    |> Property.with_id_in(ids)
    |> Repo.all()
    |> Repo.ok_error()
  end

  def get_property_by_id_for_user(%User{} = user, id) do
    {:ok, property_ids} = PropertyAgentContext.get_managed_property_ids_for_agent(user.agency_agent)

    Property
    |> Property.with_id(id)
    |> Property.with_id_in(property_ids)
    |> Property.default_preloads()
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
