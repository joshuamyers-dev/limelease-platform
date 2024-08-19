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
          Notifications.send_welcome_email_to_tenants(property, user)
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
    files = Helpers.upload_temporary_fs_files(files)

    {:ok, files}
  end

  defp prepare_tenants(tenants) do
    tenants =
      Enum.map(tenants, fn tenant ->
        found_tenant =
          case TenantContext.get_tenant_by_id(tenant.id) do
            {:ok, %Tenant{} = tenant} ->
              tenant

            _ ->
              nil
          end

        %{
          id: Map.get(found_tenant, :id),
          user: %{
            id: Map.get(found_tenant, :user_id),
            profile: %{
              id:
                case found_tenant != nil do
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

      with %Ecto.Changeset{valid?: true} <- changeset do
        changeset
        |> Repo.update()
        |> Repo.ok_error()
      else
        _ -> {:error, changeset}
      end
    end
  end
end
