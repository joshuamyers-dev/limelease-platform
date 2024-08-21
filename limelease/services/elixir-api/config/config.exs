# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :lime_lease,
  ecto_repos: [LimeLease.Repo]

# Configures the endpoint
config :lime_lease, LimeLeaseWeb.Endpoint,
  adapter: Bandit.PhoenixAdapter,
  url: [host: "localhost"],
  render_errors: [view: LimeLeaseWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: LimeLease.PubSub,
  live_view: [signing_salt: "dxuA52lf"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :lime_lease, LimeLease.Mailer, adapter: Swoosh.Adapters.Local

config :swoosh, :api_client, Swoosh.ApiClient.Req

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.14.29",
  default: [
    args: ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

config :lime_lease, Oban,
  engine: Oban.Engines.Basic,
  queues: [sms: 1, email: 2],
  plugins: [{Oban.Plugins.Pruner, max_age: 60 * 60 * 24 * 7}],
  repo: LimeLease.Repo

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Configure apps to use Jsonrs for JSON encoding
config :phoenix, :json_library, Jsonrs
config :postgrex, :json_library, Jsonrs
# config :jose, :json_module, Jsonrs
config :absinthe, :json_codec, Jsonrs
config :ex_aws, :json_codec, Jsonrs

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
