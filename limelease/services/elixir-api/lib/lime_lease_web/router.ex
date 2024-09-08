defmodule LimeLeaseWeb.Router do
  use LimeLeaseWeb, :router
  use Honeybadger.Plug

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug LimeLeaseWeb.Plug.Context
  end

  pipeline :authenticated do
    plug Guardian.Plug.Pipeline,
      module: LimeLease.Guardian,
      error_handler: LimeLease.AuthErrorHandler

    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.EnsureAuthenticated
    plug Guardian.Plug.LoadResource
  end

  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: LimeLeaseWeb.Telemetry
    end
  end

  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  scope "/" do
    get("/health", LimeLeaseWeb.WebhookController, :health_check)
  end

  scope "/" do
    pipe_through :api

    post("/webhook/clicksend", LimeLeaseWeb.WebhookController, :inbound_sms)

    scope "/" do
      pipe_through :authenticated
      post("/temp-file", LimeLeaseWeb.TempFileController, :upload_temp_photo)
    end

    if Mix.env() == :dev do
      forward "/graphiql", Absinthe.Plug.GraphiQL, schema: LimeLeaseWeb.Schema, socket: LimeLeaseWeb.UserSocket, json_codec: Jsonrs
    end

    forward "/", Absinthe.Plug, schema: LimeLeaseWeb.Schema, json_codec: Jsonrs
  end
end
