defmodule LimeLease.User.UserContext do
  @moduledoc false
  alias LimeLease.ContractorJob.ContractorJob
  alias LimeLease.User.User
  alias LimeLease.Contractor.{Contractor, ContractorContext}

  alias LimeLease.Repo

  def get_user_by_email(email) do
    User
    |> User.with_email(email)
    |> User.default_preloads()
    |> Repo.one()
    |> Repo.ok_error()
  end

  def get_user_by_id(user_id) do
    User
    |> User.with_id(user_id)
    |> User.default_preloads()
    |> Repo.one()
    |> Repo.ok_error()
  end

  @spec can_assign_request_to_contractor(LimeLease.User.User.t(), LimeLease.Contractor.Contractor.t()) :: {:error, :unauthorized} | {:ok, :can_assign_request_to_contractor}
  def can_assign_request_to_contractor(%User{} = user, %Contractor{} = contractor) do
    case contractor.agency_id == user.agency.id do
      true -> {:ok, :can_assign_request_to_contractor}
      false -> {:error, :unauthorized}
    end
  end

  def can_delete_contractor_job(%User{} = user, %ContractorJob{} = contractor_job) do
    case contractor_job.contractor.agency_id == user.agency.id do
      true -> {:ok, :can_delete_contractor_job}
      false -> {:error, :unauthorized}
    end
  end

  # Dataloader functions
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
