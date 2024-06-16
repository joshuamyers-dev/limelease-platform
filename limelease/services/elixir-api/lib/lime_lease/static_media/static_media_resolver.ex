defmodule LimeLease.StaticMedia.StaticMediaResolver do
  alias LimeLease.StaticMedia.{StaticMedia, StaticMediaService, StaticMediaContext}

  alias LimeLease.Services.AWS

  require IEx

  def static_media_create_mutation(_parent, %{file_name: file_name, mime_type: mime_type}, _resolver) do
    StaticMediaService.create_static_media(file_name, mime_type)
  end

  def static_media_create_mutation(_parent, %{s3_key: s3_key, mime_type: mime_type}, _resolver) do
    StaticMediaService.create_static_media_with_s3_key(s3_key, mime_type)
  end

  def static_media_upload_url_field(%StaticMedia{} = static_media, _args, _context) do
    AWS.generate_presigned_put_url(static_media.s3_key, static_media.mime_type)
  end

  def static_media_url_field(%StaticMedia{} = static_media, _args, _context) do
    AWS.generate_presigned_get_url(static_media.s3_key)
  end
end
