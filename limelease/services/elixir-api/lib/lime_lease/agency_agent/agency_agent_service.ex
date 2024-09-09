defmodule LimeLease.AgencyAgent.AgencyAgentService do
  require IEx
  alias LimeLease.Agency.{Agency, AgencyContext}
  alias LimeLease.Property.Property
  alias LimeLease.PropertyAgent.PropertyAgent
  alias LimeLease.Property.PropertyContext
  alias LimeLease.InvitationCode.{InvitationCode, InvitationCodeContext}
  alias LimeLease.Notifications
  alias LimeLease.AgencyAgent.{AgencyAgent, AgencyAgentContext}

  alias LimeLease.Repo

  def create_team_member_for_agency(agency_id, args) do
    with {:ok, %Agency{} = agency} <- AgencyContext.get_agency_by_id(agency_id),
         invite_code <- UUIDv7.generate() do
      changeset =
        %AgencyAgent{}
        |> AgencyAgent.changeset(%{
          agency_id: agency.id,
          property_agents: build_agents_for_association(args.assigned_property_ids),
          user: %{
            profile: %{
              email: args.email,
              phone_number: args.phone_number,
              first_name: args.first_name,
              last_name: args.last_name
            }
          }
        })

      with %Ecto.Changeset{valid?: true} = changeset <- changeset,
           {:ok, %AgencyAgent{} = agent} <- AgencyAgentContext.create_team_member_for_agency(agency_id, args),
           agent <- Repo.preload(agent, user: [:agency, :profile]),
           {:ok, %InvitationCode{} = _code} <-
             InvitationCodeContext.create_invitation_code(%{email: args.email, code: invite_code}),
           {:ok, %Oban.Job{} = _job} <- Notifications.send_team_member_invite(agent, invite_code) do
        {:ok, agent}
      else
        {:error, %Ecto.Changeset{} = changeset} ->
          {:error, changeset}
      end
    end
  end

  def build_agents_for_association(assigned_property_ids) do
    Enum.map(assigned_property_ids, fn property_id ->
      %{
        property_id: property_id
      }
    end)
  end
end
