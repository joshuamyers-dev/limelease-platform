defmodule LimeLease.Property.PropertyFile.PropertyFileSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.{Authorize, EctoErrors}
  alias LimeLeaseWeb.Middleware.EctoErrors

  import Absinthe.Resolution.Helpers

  require IEx

  object :property_file do
    field(:id, non_null(:id))
    field(:file_name, non_null(:string))
    field(:inserted_at, non_null(:datetime))

    field(:static_media, :static_media) do
      resolve(dataloader(LimeLease.Property.PropertyFile.PropertyFileContext, :static_media))
    end
  end
end
