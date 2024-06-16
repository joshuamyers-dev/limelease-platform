defmodule LimeLease.Contractor.ContractorResolver do
  require IEx
  alias LimeLease.Contractor.{Contractor, ContractorContext}

  def my_contractors_query(_parent, pagination_args, %{context: %{current_user: user}}) do
    search_term = Map.get(pagination_args, :search_term, nil)

    case search_term == nil do
      true -> ContractorContext.get_paginated_contractors_for_user(user, pagination_args)
      false -> ContractorContext.search_contractors(search_term, pagination_args, user)
    end
  end

  def fetch_contractor_query(_parent, %{contractor_id: contractor_id}, %{context: %{current_user: user}}) do
    ContractorContext.get_contractor_by_id(contractor_id, user)
  end

  def create_contractor_mutation(_parent, args, %{context: %{current_user: user}}) do
    ContractorContext.create_contractor(args, user)
  end

  def search_contractors_query(_parent, %{search_term: search_term} = pagination_args, %{context: %{current_user: user}}) do
    ContractorContext.search_contractors(search_term, pagination_args, user)
  end

  def contractor_jobs_field(%Contractor{} = contractor, args, %{context: %{current_user: user}}) do
    ContractorContext.get_paginated_jobs_for_contractor(contractor, args, user)
  end

  def contractor_count_query(_parent, _args, %{context: %{current_user: user}}) do
      ContractorContext.count_contractors_for_user(user)
  end
end
