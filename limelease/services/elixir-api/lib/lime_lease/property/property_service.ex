defmodule LimeLease.Property.PropertyService do
  alias LimeLease.Notifications
  alias LimeLease.Property.{Property, PropertyContext}
  alias LimeLease.User.User
  alias LimeLease.Tenant.{Tenant, TenantContext}
  alias LimeLease.StaticMedia.{StaticMedia, StaticMediaService}

  alias LimeLease.Services.AWS
  alias LimeLease.Helpers
  alias LimeLeaseWeb.Emails

  alias LimeLease.Repo

  require IEx

  def create_property(
        %User{} = user,
        %{address: _address, bathrooms: _bathrooms, bedrooms: _bedrooms, carspaces: _carspaces} =
          property_details,
        lease_details,
        photos,
        tenants,
        landlords,
        files
      ) do
    with {:ok, photos} <- prepare_photos(photos),
         {:ok, files} <- prepare_files(files),
         {:ok, tenants} <- prepare_tenants(tenants) do
      changeset = build_changeset(nil, property_details, landlords, photos, tenants, files, lease_details, user)

      with %Ecto.Changeset{valid?: true} <- changeset,
           {:ok, %Property{} = property} <-
             changeset
             |> Repo.insert()
             |> Repo.ok_error() do
        spawn(fn ->
          Notifications.send_welcome_email_to_property_tenants(property, user)
        end)

        {:ok, property}
      else
        _ -> {:error, changeset}
      end
    end
  end

  defp prepare_photos(photos) when length(photos) > 0 do
    for_user_upload = Enum.filter(photos, &Map.has_key?(&1, :uri_path))
    for_system_upload = Enum.filter(photos, &Map.has_key?(&1, :url))

    case length(for_user_upload) > 0 do
      true ->
        photos = Helpers.upload_temporary_fs_photos(for_user_upload)

        {:ok, photos}

      false ->
        case length(for_system_upload) > 1 do
          true ->
            photos = Helpers.upload_external_photos(for_system_upload)

            {:ok, photos}

          false ->
            {:ok, photos}
        end
    end
  end

  defp prepare_photos(photos), do: photos

  defp prepare_files(files) do
    for_user_upload = Enum.filter(files, &Map.has_key?(&1, :uri_path))
    prev_files = Enum.filter(files, &Map.has_key?(&1, :id))

    case length(for_user_upload) > 0 do
      true ->
       new_files = Helpers.upload_temporary_fs_files(for_user_upload)
       |> Enum.map(fn file ->
          %{
            type: file.type,
            file_name: file.file_name,
            file_type: file.type,
            static_media_id: file.static_media_id
          }
        end)

        {:ok, prev_files ++ new_files}

      false ->
        files = Enum.map(files, fn file ->
          %{
            id: Map.get(file, :id),
            static_media_id: Map.get(file, :static_media_id),
            file_name: file.name,
            file_type: file.type
          }
        end
        )

        {:ok, files}
    end
  end

  defp prepare_tenants(tenants) do
    tenants =
      Enum.map(tenants, fn tenant ->
        found_tenant =
          case Map.has_key?(tenant, :id) do
            true ->
              with {:ok, %Tenant{} = tenant} <- TenantContext.get_tenant_by_id(tenant.id) do
                tenant
              else
                _ ->
                  %{}
              end

            false ->
              %{}
          end

        %{
          id: Map.get(found_tenant, :id),
          user: %{
            id: Map.get(found_tenant, :user_id),
            profile: %{
              id:
                case Map.has_key?(tenant, :id) do
                  true ->
                    found_tenant.user.profile_id

                  false ->
                    nil
                end,
              first_name: tenant.first_name,
              last_name: tenant.last_name,
              phone_number: tenant.phone_number,
              email: tenant.email
            }
          }
        }
      end)

    {:ok, tenants}
  end

  defp build_changeset(
         property,
         property_details,
         landlords,
         photos,
         tenants,
         files,
         lease_details,
         %User{} = user
       ) do
    params =
      Map.merge(property_details, %{
        landlords: landlords,
        photos: photos,
        files: files,
        lease: lease_details,
        tenants: tenants
      })

    case property do
      nil ->
        %Property{}
        |> Property.create_changeset(params, user.agency_agent)

      %Property{} = property ->
        property
        |> Property.update_changeset(params)
    end
  end

  def update_property(
        property_id,
        %User{} = user,
        %{address: _address, bathrooms: _bathrooms, bedrooms: _bedrooms, carspaces: _carspaces} =
          property_details,
        lease_details,
        photos,
        tenants,
        landlords,
        files
      ) do
    with {:ok, %Property{} = property} <-
           PropertyContext.get_property_by_id_for_user(user, property_id),
         {:ok, photos} <- prepare_photos(photos),
         {:ok, files} <- prepare_files(files),
         {:ok, tenants} <- prepare_tenants(tenants) do
      changeset =
        build_changeset(
          property,
          property_details,
          landlords,
          photos,
          tenants,
          files,
          lease_details,
          user
        )

      with %Ecto.Changeset{valid?: true} <- changeset,
           {:ok, %Property{} = updated_property} <-
             changeset
             |> Repo.update()
             |> Repo.ok_error() do
        spawn(fn ->
          old_tenant_ids = Enum.map(property.tenants, & &1.user.id)
          new_tenants = Enum.filter(updated_property.tenants, &(&1.user.id not in old_tenant_ids))

          case length(new_tenants) > 0 do
            true ->
              Notifications.send_welcome_email_to_property_tenants(updated_property, user, new_tenants)

            false ->
              :ok
          end
        end)

        {:ok, updated_property}
      else
        _ -> {:error, changeset}
      end
    end
  end
end
