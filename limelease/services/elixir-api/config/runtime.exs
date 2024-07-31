import Config

# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# system starts, so it is typically used to load production configuration
# and secrets from environment variables or elsewhere. Do not define
# any compile-time configuration in here, as it won't be applied.
# The block below contains prod specific runtime configuration.

# ## Using releases
#
# If you use `mix release`, you need to explicitly enable the server
# by passing the PHX_SERVER=true when you start it:
#
#     PHX_SERVER=true bin/lime_lease start
#
# Alternatively, you can use `mix phx.gen.release` to generate a `bin/server`
# script that automatically sets the env var above.
if System.get_env("PHX_SERVER") do
  config :lime_lease, LimeLeaseWeb.Endpoint, server: true
end

if config_env() == :prod do
  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASS@HOST/DATABASE
      """

  maybe_ipv6 = if System.get_env("ECTO_IPV6"), do: [:inet6], else: []

  config :lime_lease, LimeLease.Repo,
    # ssl: true,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
    socket_options: maybe_ipv6

  # The secret key base is used to sign/encrypt cookies and other secrets.
  # A default value is used in config/dev.exs and config/test.exs but you
  # want to use a different value for prod and you most likely don't want
  # to check this value into version control, so we use an environment
  # variable instead.
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  host = System.get_env("PHX_HOST") || "example.com"
  port = String.to_integer(System.get_env("PORT") || "4000")

  config :lime_lease, LimeLeaseWeb.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    http: [
      # Enable IPv6 and bind on all interfaces.
      # Set it to  {0, 0, 0, 0, 0, 0, 0, 1} for local network only access.
      # See the documentation on https://hexdocs.pm/plug_cowboy/Plug.Cowboy.html
      # for details about using IPv6 vs IPv4 and loopback vs public addresses.
      ip: {0, 0, 0, 0, 0, 0, 0, 0},
      port: port
    ],
    secret_key_base: secret_key_base

  config :lime_lease,
    clicksend_api_username: System.fetch_env!("CLICKSEND_API_USERNAME"),
    clicksend_api_key: System.fetch_env!("CLICKSEND_API_KEY"),
    front_end_url: System.fetch_env!("FRONT_END_URL")

  config :lime_lease, LimeLease.Guardian,
    issuer: "limelease",
    secret_key: secret_key_base

  config :ex_aws,
    access_key_id: System.fetch_env!("AWS_KEY_ID"),
    secret_access_key: System.fetch_env!("AWS_SECRET_KEY"),
    region: "ap-southeast-2",
    bucket: System.fetch_env!("AWS_BUCKET"),
    static_folder: System.fetch_env!("AWS_STATIC_FOLDER"),
    api_gateway_endpoint: System.fetch_env!("API_GATEWAY_ENDPOINT")

  config :lime_lease, LimeLease.Mailer,
    adapter: Swoosh.Adapters.Postmark,
    api_key: System.fetch_env!("POSTMARK_API_KEY")
end
