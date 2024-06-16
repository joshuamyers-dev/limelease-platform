defmodule LimeLease.Contractor.Contractor do
  @moduledoc false

  use Ecto.Schema

  alias LimeLease.Agency.Agency
  alias LimeLease.Helpers

  import Ecto.{Changeset, Query}

  import LimeLease.ChangesetHelpers

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "contractors" do
    field :business_name, :string
    field :website_url, :string
    field :contact_email, :string
    field :contact_number, :string
    field :areas_served, {:array, :string}
    field :address, {:map, :string}

    belongs_to(:agency, LimeLease.Agency.Agency, type: :binary_id)
    has_many(:jobs, LimeLease.ContractorJob.ContractorJob)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(contractor, attrs, %Agency{} = agency) do
    contractor
    |> cast(attrs, [:business_name, :website_url, :contact_email, :contact_number, :areas_served, :address])
    |> validate_required([:business_name, :contact_number, :contact_email])
    |> validate_contact_number(:contact_number)
    |> validate_email(:contact_email)
    |> validate_website_url()
    |> format_contact_number(:contact_number)
    |> put_assoc(:agency, agency)
  end

  def with_agency_id(query, agency_id) do
    query
    |> where([q], q.agency_id == ^agency_id)
  end

  def with_id(query, id) do
    query
    |> where([q], q.id == ^id)
  end

  def with_contact_number(query, contact_number) do
    query
    |> where([q], q.contact_number == ^contact_number)
  end

  def order_by_name_alphabetical(query) do
    query
    |> order_by([q], asc: q.business_name)
  end

  def search_by_name(query, name) do
    name = LimeLease.Helpers.format_search_keywords_ts_query(name)

    query
    |> where([q], fragment("? @@ to_tsquery('english', ?)", q.business_name, ^name))
  end
end
