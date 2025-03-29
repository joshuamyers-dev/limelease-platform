defmodule LimeLease.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      LimeLease.Repo,
      # Start Oban - for job processing
      {Oban, Application.fetch_env!(:lime_lease, Oban)},
      # Start the Telemetry supervisor
      LimeLeaseWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: LimeLease.PubSub},
      # Start the Endpoint (http/https)
      LimeLeaseWeb.Endpoint,
      {Absinthe.Subscription, LimeLeaseWeb.Endpoint},
      # Firebase Cloud Messaging
      # {LimeLease.FCM, fcm_opts()}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: LimeLease.Supervisor]
    Supervisor.start_link(children, opts)
  end

  defp fcm_opts do
    [
      adapter: Pigeon.FCM,
      project_id: "limelease",
      service_account_json: File.read!("#{:code.priv_dir(:lime_lease)}" <> "/static/service-account.json")
    ]
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    LimeLeaseWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
