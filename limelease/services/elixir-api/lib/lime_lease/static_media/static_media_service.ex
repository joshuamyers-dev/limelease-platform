defmodule LimeLease.StaticMedia.StaticMediaService do
  alias LimeLease.StaticMedia.StaticMediaContext

  alias LimeLease.Services.AWS

  def create_static_media(file_name, mime_type) do
    image_id = AWS.generate_image_id(file_name)

    StaticMediaContext.create_static_media(%{
      s3_key: image_id,
      mime_type: mime_type
    })
  end

  def create_static_media_with_s3_key(s3_key, mime_type) do
    StaticMediaContext.create_static_media(%{
      s3_key: s3_key,
      mime_type: mime_type
    })
  end
end
