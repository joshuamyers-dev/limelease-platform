defmodule LimeLease.Contractor.ContractorContext do
  @moduledoc false

  alias LimeLease.Contractor.{Contractor, ContractorContext}
  alias LimeLease.ContractorJob.{ContractorJob, ContractorJobContext}
  alias LimeLease.User.User

  alias LimeLease.Repo

  def get_paginated_contractors_for_user(%User{agency: %{id: agency_id}}, pagination_args) do
    Contractor
    |> Contractor.with_agency_id(agency_id)
    |> Contractor.order_by_name_alphabetical()
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, pagination_args)
  end

  def get_contractor_by_id(contractor_id, %User{} = user) do
    Contractor
    |> Contractor.with_agency_id(user.agency.id)
    |> Contractor.with_id(contractor_id)
    |> Repo.one()
    |> Repo.ok_error()
  end

  def get_contractor_by_contact_number(contact_number) do
    Contractor
    |> Contractor.with_contact_number(contact_number)
    |> Repo.one()
    |> Repo.ok_error()
  end

  def get_paginated_jobs_for_contractor(%Contractor{} = contractor, args, %User{} = user) do
    ContractorJob
    |> ContractorJob.with_contractor_id(contractor.id)
    |> ContractorJob.translate_state_into_filter(args.state)
    |> ContractorJob.order_by_inserted_desc()
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, args)
  end

  def create_contractor(args, %User{} = user) do
    %Contractor{}
    |> Contractor.create_changeset(args, user.agency)
    |> Repo.insert()
    |> Repo.ok_error()
  end

  def count_contractors_for_user(%User{} = user) do
    Contractor
    |> Contractor.with_agency_id(user.agency.id)
    |> Repo.aggregate(:count, :id)
    |> Repo.ok_error()
  end

  def search_contractors(search_term, pagination_args, %User{} = user) do
    Contractor
    |> Contractor.with_agency_id(user.agency.id)
    |> Contractor.search_by_name(search_term)
    |> Contractor.order_by_name_alphabetical()
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, pagination_args)
  end

  # Dataloader functions
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
