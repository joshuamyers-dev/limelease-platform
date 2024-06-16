defmodule LimeLease.ContractorJob.ContractorJobService do
  alias LimeLease.User.{User, UserContext}
  alias LimeLease.PropertyRequest.{PropertyRequest, PropertyRequestContext}
  alias LimeLease.PropertyRequestComment.{PropertyRequestComment, PropertyRequestCommentContext}
  alias LimeLease.Contractor.{Contractor, ContractorContext}
  alias LimeLease.ContractorJob.{ContractorJob, ContractorJobContext}
  alias LimeLease.GenServers.SmsQueue

  alias LimeLease.Services.{AWS, ClickSend}
  alias LimeLease.Repo

  import Ecto.Changeset

  require IEx
  require Logger

  def create_contractor_job(contractor_id, request_id, booking_date_start, booking_date_end, description, contractor_message, %User{} = user) do
    with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.get_request_by_id(request_id),
         {:ok, %Contractor{} = contractor} <- ContractorContext.get_contractor_by_id(contractor_id, user),
         {:ok, :can_assign_request_to_contractor} <- UserContext.can_assign_request_to_contractor(user, contractor) do
      comment_changeset =
        PropertyRequestComment.create_changeset(
          %PropertyRequestComment{},
          %{message_body: "A job was created and assigned to #{contractor.business_name}.", author_name: "#{user.first_name} #{user.last_name}", system_generated: true},
          request
        )

      multi =
        Ecto.Multi.new()
        |> Ecto.Multi.insert(
          :contractor_job,
          ContractorJob.create_changeset(
            %ContractorJob{},
            %{booking_date_start: booking_date_start, booking_date_end: booking_date_end, description: description},
            contractor,
            request
          )
        )
        |> Ecto.Multi.update(:request, PropertyRequest.update_state_changeset(request, %{state: :assigned_to_contractor}))
        |> Ecto.Multi.insert(:comment, comment_changeset)

      case Repo.transaction(multi) do
        {:ok, %{contractor_job: contractor_job}} ->
          spawn(fn ->
            send_new_job_notifications_for_contractor(contractor, request, contractor_message)
          end)

          {:ok, contractor_job}

        {:error, _, changeset, _} ->
          {:error, changeset}
      end
    else
      {:error, :not_found} -> {:error, "The request you are trying to assign to this contractor does not exist."}
      {:error, :unauthorized} -> {:error, "You are not authorised to assign this request to this contractor."}
    end
  end

  def get_jobs_for_contractor(contractor_id, args, %User{} = user) do
    with {:ok, %Contractor{} = contractor} <- ContractorContext.get_contractor_by_id(contractor_id, user) do
      ContractorContext.get_paginated_jobs_for_contractor(contractor, args, user)
    end
  end

  def get_contractor_job_for_request(request_id) do
    with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.get_request_by_id(request_id),
         {:ok, %ContractorJob{} = job} <- ContractorJobContext.get_contractor_job_for_request(request) do
      {:ok, job}
    else
      {:error, :not_found} -> {:ok, nil}
    end
  end

  def delete_contractor_job(id, %User{} = user) do
    with {:ok, %ContractorJob{} = contractor_job} <- ContractorJobContext.get_contractor_job_by_id(id),
         {:ok, :can_delete_contractor_job} <- UserContext.can_delete_contractor_job(user, contractor_job) do
      changeset_attrs = %{
        message_body: "The job assigned to #{contractor_job.contractor.business_name} was removed.",
        author_name: "#{user.first_name} #{user.last_name}",
        system_generated: true
      }

      comment_changeset =
        %PropertyRequestComment{}
        |> PropertyRequestComment.create_changeset(
          changeset_attrs,
          contractor_job.request
        )

      multi =
        Ecto.Multi.new()
        |> Ecto.Multi.delete(:contractor_job, contractor_job)
        |> Ecto.Multi.update(:request, PropertyRequest.update_state_changeset(contractor_job.request, %{state: :assigned_to_contractor}))
        |> Ecto.Multi.insert(:comment, comment_changeset)

      case Repo.transaction(multi) do
        {:ok, %{contractor_job: contractor_job}} -> {:ok, contractor_job}
        {:error, _, changeset, _} -> {:error, changeset}
      end
    else
      {:error, :not_found} -> {:error, "The contractor job you are trying to delete does not exist."}
      {:error, :unauthorized} -> {:error, "You are not authorised to delete this contractor job."}
    end
  end

  def send_new_job_notifications_for_contractor(%Contractor{} = contractor, %PropertyRequest{} = request, message_body) do
    case length(request.photos) > 0 do
      true ->
        with {:ok, image_url} = AWS.generate_presigned_get_url(Enum.at(request.photos, 0).static_media.s3_key),
             {:ok, converted_image_url} <- ClickSend.convert_file_for_mms(image_url) do
          Logger.info(converted_image_url)
          SmsQueue.enqueue_sms(contractor.contact_number, message_body, converted_image_url)
        else
          err -> Logger.error("Couldnt send MMS notifications for contractor job. Reason: #{inspect(err)}")
        end

      false ->
        SmsQueue.enqueue_sms(contractor.contact_number, message_body)
    end
  end
end
