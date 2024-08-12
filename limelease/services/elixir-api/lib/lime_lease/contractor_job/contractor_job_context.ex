defmodule LimeLease.ContractorJob.ContractorJobContext do
  @moduledoc false

  alias LimeLease.PropertyRequest.PropertyRequest
  alias LimeLease.User.User
  alias LimeLease.Contractor.Contractor
  alias LimeLease.ContractorJob.ContractorJob

  alias LimeLease.Repo

  def create_contractor_job(args, %PropertyRequest{} = request, %Contractor{} = contractor) do
    %ContractorJob{}
    |> ContractorJob.create_changeset(args, contractor, request)
    |> Repo.insert()
    |> Repo.ok_error()
  end

  def get_contractor_job_for_request(%PropertyRequest{} = request) do
    ContractorJob
    |> ContractorJob.with_request_id(request.id)
    |> ContractorJob.order_by_inserted_desc()
    |> ContractorJob.with_limit(1)
    |> ContractorJob.default_preloads()
    |> Repo.one()
    |> Repo.ok_error()
  end

  def get_contractor_job_for_tenant(%User{} = user) do
    ContractorJob
    |> ContractorJob.with_property(user.tenant.property_id)
    |> ContractorJob.order_by_inserted_desc()
    |> ContractorJob.with_limit(1)
    |> ContractorJob.default_preloads()
    |> Repo.one()
    |> Repo.ok_error()
  end

  def get_contractor_job_by_id(id) do
    ContractorJob
    |> ContractorJob.with_id(id)
    |> ContractorJob.default_preloads()
    |> Repo.one()
    |> Repo.ok_error()
  end

  def update_contractor_job_state(%ContractorJob{} = contractor_job, state) do
    contractor_job
    |> ContractorJob.update_state_changeset(%{state: state})
    |> Repo.update()
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
