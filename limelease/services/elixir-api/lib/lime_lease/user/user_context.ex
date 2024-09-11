defmodule LimeLease.User.UserContext do
  @moduledoc false
  alias LimeLease.AgencyAgent.AgencyAgent
  alias LimeLease.ContractorJob.ContractorJob
  alias LimeLease.Agency.Agency
  alias LimeLease.User.User
  alias LimeLease.Contractor.{Contractor, ContractorContext}

  alias LimeLease.Repo

  import Ecto.Query

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

  def update_user(%User{} = user, attrs) do
    user
    |> User.update_changeset(attrs)
    |> Repo.update()
    |> Repo.ok_error()
  end

  @spec can_assign_request_to_contractor?(LimeLease.User.User.t(), LimeLease.Contractor.Contractor.t()) :: {:error, :unauthorized} | {:ok, :can_assign_request_to_contractor}
  def can_assign_request_to_contractor?(%User{agency: %Agency{id: user_agency_id}}, %Contractor{} = contractor) do
    case contractor.agency_id == user_agency_id do
      true -> :ok
      false -> {:error, :unauthorized}
    end
  end

  def admin_of_agency?(%User{agency_agent: %AgencyAgent{role: role}}) do
    case role == "admin" do
      true -> :ok
      false -> {:error, :unauthorized}
    end
  end

  def can_delete_contractor_job?(%User{agency: %Agency{id: user_agency_id}}, %ContractorJob{contractor: %Contractor{agency_id: contractor_agency_id}}) do
    case contractor_agency_id == user_agency_id do
      true -> :ok
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
