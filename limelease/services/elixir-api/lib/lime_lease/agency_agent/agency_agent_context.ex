defmodule LimeLease.AgencyAgent.AgencyAgentContext do
  @moduledoc false

  require IEx
  alias LimeLease.Property.PropertyContext
  alias LimeLease.AgencyAgent.AgencyAgent
  alias LimeLease.Repo

  def fetch_team_members_for_agency(agency_id, search_term, pagination_args) do
    AgencyAgent
    |> AgencyAgent.with_agency(agency_id)
    |> apply_search(search_term)
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, pagination_args)
  end

  defp apply_search(query, nil = _search_term), do: query

  defp apply_search(query, search_term) when is_binary(search_term) do
    query |> AgencyAgent.search_by_name(search_term)
  end

  def create_team_member_for_agency(agency_id, args) do
    {:ok, assigned_properties} = PropertyContext.get_properties_by_ids(args.assigned_property_ids)

    %AgencyAgent{}
    |> AgencyAgent.changeset(%{
      agency_id: agency_id,
      property_agents: Enum.map(assigned_properties, &%{property_id: &1.id}),
      user: %{
        profile: %{
          email: args.email,
          phone_number: args.phone_number,
          first_name: args.first_name,
          last_name: args.last_name
        }
      },
      assigned_properties: assigned_properties
    })
    |> Repo.insert()
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
