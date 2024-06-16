defmodule LimeLease.StaticMedia.StaticMediaSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.{Authorize, EctoErrors}

  object :static_media do
    field(:id, non_null(:id))
    field(:s3_key, :string)

    field(:url, :string) do
      resolve(&LimeLease.StaticMedia.StaticMediaResolver.static_media_url_field/3)
    end

    field(:upload_url, :string) do
      resolve(&LimeLease.StaticMedia.StaticMediaResolver.static_media_upload_url_field/3)
    end
  end

  connection(node_type: :static_media)

  object :static_media_mutations do
    @desc "Create a new static media asset."
    field :static_media_create, non_null(:static_media) do
      arg(:s3_key, :string)
      arg(:file_name, :string)
      arg(:mime_type, non_null(:string))

      middleware(Authorize)
      middleware(EctoErrors)
      resolve(&LimeLease.StaticMedia.StaticMediaResolver.static_media_create_mutation/3)
    end
  end
end
