defmodule LimeLease.Property.Property do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  alias LimeLease.AgencyAgent.AgencyAgent
  alias LimeLease.User.User
  alias LimeLease.PropertyAgent.PropertyAgent

  alias LimeLease.Helpers

  require IEx

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "properties" do
    field :bedrooms, :integer
    field :bathrooms, :integer
    field :carspaces, :integer

    embeds_many :photos, LimeLease.Property.PropertyPhoto
    embeds_many :landlords, LimeLease.Property.PropertyLandlord
    embeds_one :address, LimeLease.Property.Address

    has_one :lease, LimeLease.Lease.Lease, on_replace: :delete

    has_many :files, LimeLease.Property.PropertyFile
    has_many :requests, LimeLease.PropertyRequest.PropertyRequest
    has_many :tenants, LimeLease.Tenant.Tenant, on_replace: :delete_if_exists
    has_many(:property_agents, LimeLease.PropertyAgent.PropertyAgent, on_replace: :delete)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(property, attrs, %AgencyAgent{} = agent) do
    property_agents = %PropertyAgent{} |> PropertyAgent.create_changeset(%{}) |> put_assoc(:agent, agent)

    property
    |> cast(attrs, [:bedrooms, :bathrooms, :carspaces])
    |> validate_required([:bedrooms, :bathrooms, :carspaces])
    |> put_embed(:photos, attrs[:photos])
    |> cast_embed(:address, with: &LimeLease.Property.Address.create_changeset/2)
    |> cast_embed(:landlords, with: &LimeLease.Property.PropertyLandlord.changeset/2)
    |> cast_assoc(:tenants, with: &LimeLease.Tenant.Tenant.create_changeset/2)
    |> cast_assoc(:files, with: &LimeLease.Property.PropertyFile.create_changeset/2)
    |> cast_assoc(:lease, with: &LimeLease.Lease.Lease.create_changeset/2)
    |> put_assoc(:property_agents, [property_agents])
  end

  def update_changeset(property, attrs) do
    property
    |> cast(attrs, [:bedrooms, :bathrooms, :carspaces])
    |> validate_required([:bedrooms, :bathrooms, :carspaces])
    |> put_embed(:photos, attrs[:photos])
    |> cast_embed(:landlords, with: &LimeLease.Property.PropertyLandlord.changeset/2)
    |> cast_assoc(:tenants, with: &LimeLease.Tenant.Tenant.update_changeset/2)
    |> cast_assoc(:files, with: &LimeLease.Property.PropertyFile.update_changeset/2)
    |> cast_assoc(:lease, with: &LimeLease.Lease.Lease.create_changeset/2)
  end

  def default_preloads(query) do
    query
    |> preload([:tenants, :lease, :files])
  end

  def with_id(query, id) do
    query
    |> where([q], q.id == ^id)
  end

  def with_id_in(query, ids) do
    query
    |> where([q], q.id in ^ids)
  end

  def order_by_inserted_date(query) do
    query
    |> order_by([q], desc: q.inserted_at)
  end

  def search_by_address(query, address) do
    case address !== "" and address !== " " do
      true ->
        address_keywords = Helpers.format_search_keywords_ts_query(address)

        query
        |> where([q], fragment("address_tsvector @@ to_tsquery('english', ?)", ^address_keywords))

      false ->
        query
    end
  end

  def translate_filter_into_query(query, filter) do
    tenant_counts =
      LimeLease.Tenant.Tenant
      |> group_by([t], t.property_id)
      |> select([t], %{property_id: t.property_id, count: count(t.id)})

    case filter do
      :occupied ->
        query
        |> join(:left, [p], t in subquery(tenant_counts), on: t.property_id == p.id)
        |> where([p, t], t.count > 0)

      :vacant ->
        query
        |> join(:left, [p], t in subquery(tenant_counts), on: t.property_id == p.id)
        |> where([p, t], is_nil(t.count) or t.count == 0)

      :all ->
        query
    end
  end
end
