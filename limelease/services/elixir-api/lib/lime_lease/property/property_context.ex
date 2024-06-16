defmodule LimeLease.Property.PropertyContext do
  @moduledoc false

  alias LimeLease.User.User
  alias LimeLease.Property.Property
  alias LimeLease.PropertyAgent.PropertyAgentContext

  alias LimeLease.Repo

  require IEx

  def get_paginated_properties_for_user(%User{} = user, filter, search_keywords, pagination_args) do
    {:ok, property_ids} = PropertyAgentContext.get_managed_property_ids_for_user(user)

    Property
    |> Property.with_id_in(property_ids)
    |> Property.translate_filter_into_query(filter)
    |> Property.search_by_address(search_keywords)
    |> Property.order_by_inserted_date()
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, pagination_args)
  end

  def get_property_by_id_for_user(%User{} = user, id) do
    {:ok, property_ids} = PropertyAgentContext.get_managed_property_ids_for_user(user)


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
