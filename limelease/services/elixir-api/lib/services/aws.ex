defmodule LimeLease.Services.AWS do
  alias ExAws.S3

  require Logger

  def upload_multipart!(file_path, file_name, file_type) do
    image_id = generate_image_id(file_name)

    file_path
    |> S3.Upload.stream_file()
    |> S3.upload(get_bucket_name(), "#{get_root_dir()}/#{image_id}", acl: :public_read, content_type: file_type)
    |> ExAws.request!()

    {:ok, image_id}
  end

  def build_bucket_url() do
    "https://#{Application.get_env(:lime_lease, :s3_settings)[:bucket]}.s3.ap-southeast-2.amazonaws.com/#{Application.get_env(:lime_lease, :s3_settings)[:static_folder]}/"
  end

  def get_bucket_name(), do: Application.get_env(:ex_aws, :bucket)

  def get_root_dir(), do: Application.get_env(:ex_aws, :static_folder)

  def bucket_config() do
    %{
      bucket_name: "#{get_bucket_name()}/#{get_root_dir()}",
      region: Application.get_env(:ex_aws, :region)
    }
  end

  def generate_presigned_put_url(s3_key, mime_type) do
    query_params = [{"ContentType", mime_type}]
    presign_options = [query_params: query_params]

    :s3
    |> ExAws.Config.new(%{
      region: bucket_config().region
    })
    |> ExAws.S3.presigned_url(:put, bucket_config().bucket_name, s3_key, presign_options)
  end

  def generate_presigned_get_url(s3_key) do
    :s3
    |> ExAws.Config.new(%{
      region: bucket_config().region
    })
    |> ExAws.S3.presigned_url(:get, bucket_config().bucket_name, s3_key, expires_in: 604_800)
  end

  def generate_image_id(file_name) do
    min = String.to_integer("10000000", 36)
    max = String.to_integer("ZZZZZZZZ", 36)
    extension = Path.extname(file_name)

    id =
      max
      |> Kernel.-(min)
      |> :rand.uniform()
      |> Kernel.+(min)
      |> Integer.to_string(36)

    id <> "_" <> Integer.to_string(Timex.now() |> Timex.to_unix()) <> extension
  end

  def send_sms(phone_number, body) do
    with {:ok, response} <-
           ExAws.SNS.publish(body, phone_number: phone_number)
           |> ExAws.request() do
            Logger.info(response)
      {:ok, :delivered}
    else
      {:error, reason} ->
        {:error, reason}
    end
  end
end
