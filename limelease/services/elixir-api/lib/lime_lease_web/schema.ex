defmodule LimeLeaseWeb.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern

  import_types(LimeLease.User.UserSchema)
  import_types(LimeLease.Property.PropertySchema)
  import_types(LimeLease.Property.PropertyFile.PropertyFileSchema)
  import_types(LimeLease.Tenant.TenantSchema)
  import_types(LimeLease.PropertyRequest.PropertyRequestSchema)
  import_types(LimeLease.PropertyAgent.PropertyAgentSchema)
  import_types(LimeLease.StaticMedia.StaticMediaSchema)
  import_types(LimeLease.Contractor.ContractorSchema)
  import_types(LimeLease.Agency.AgencySchema)
  import_types(LimeLease.AgencyAgent.AgencyAgentSchema)
  import_types(LimeLease.ContractorJob.ContractorJobSchema)
  import_types(LimeLease.PropertyRequestComment.PropertyRequestCommentSchema)
  import_types(LimeLease.PropertyRequestCategory.PropertyRequestCategorySchema)
  import_types(LimeLease.Lease.LeaseSchema)
  import_types(LimeLease.Profile.ProfileSchema)
  import_types(LimeLease.Task.TaskSchema)
  import_types(LimeLease.PropertyTask.PropertyTaskSchema)
  import_types(Absinthe.Type.Custom)

  query do
    import_fields(:user_queries)
    import_fields(:property_queries)
    import_fields(:property_request_queries)
    import_fields(:contractor_queries)
    import_fields(:contractor_job_queries)
    import_fields(:property_request_comment_queries)
    import_fields(:property_request_category_queries)
    import_fields(:agency_agent_queries)
    import_fields(:lease_queries)
    import_fields(:property_task_queries)
  end

  mutation do
    import_fields(:user_mutations)
    import_fields(:property_mutations)
    import_fields(:property_request_mutations)
    import_fields(:static_media_mutations)
    import_fields(:contractor_mutations)
    import_fields(:contractor_job_mutations)
    import_fields(:property_request_comment_mutations)
    import_fields(:profile_mutations)
    import_fields(:agency_agent_mutations)
    import_fields(:property_task_mutations)
  end

  def dataloader() do
    alias LimeLease.User.UserContext
    alias LimeLease.Property.PropertyContext
    alias LimeLease.Property.PropertyFile.PropertyFileContext
    alias LimeLease.Tenant.TenantContext
    alias LimeLease.PropertyRequest.PropertyRequestContext
    alias LimeLease.PropertyAgent.PropertyAgentContext
    alias LimeLease.StaticMedia.StaticMediaContext
    alias LimeLease.Contractor.ContractorContext
    alias LimeLease.Agency.AgencyContext
    alias LimeLease.AgencyAgent.AgencyAgentContext
    alias LimeLease.ContractorJob.ContractorJobContext
    alias LimeLease.PropertyRequestComment.PropertyRequestCommentContext
    alias LimeLease.PropertyRequestCategory.PropertyRequestCategoryContext
    alias LimeLease.Lease.LeaseContext
    alias LimeLease.Profile.ProfileContext
    alias LimeLease.PropertyTask.PropertyTaskContext

    Dataloader.new()
    |> Dataloader.add_source(UserContext, UserContext.data())
    |> Dataloader.add_source(PropertyContext, PropertyContext.data())
    |> Dataloader.add_source(PropertyFileContext, PropertyFileContext.data())
    |> Dataloader.add_source(TenantContext, TenantContext.data())
    |> Dataloader.add_source(PropertyRequestContext, PropertyRequestContext.data())
    |> Dataloader.add_source(PropertyAgentContext, PropertyAgentContext.data())
    |> Dataloader.add_source(StaticMediaContext, StaticMediaContext.data())
    |> Dataloader.add_source(ContractorContext, ContractorContext.data())
    |> Dataloader.add_source(AgencyContext, AgencyContext.data())
    |> Dataloader.add_source(ContractorJobContext, ContractorJobContext.data())
    |> Dataloader.add_source(PropertyRequestCommentContext, PropertyRequestCommentContext.data())
    |> Dataloader.add_source(PropertyRequestCategoryContext, PropertyRequestCategoryContext.data())
    |> Dataloader.add_source(AgencyAgentContext, AgencyAgentContext.data())
    |> Dataloader.add_source(LeaseContext, LeaseContext.data())
    |> Dataloader.add_source(ProfileContext, ProfileContext.data())
    |> Dataloader.add_source(PropertyTaskContext, PropertyTaskContext.data())
  end

  def plugins do
    [Absinthe.Middleware.Dataloader | Absinthe.Plugin.defaults()]
  end

  def context(ctx) do
    Map.put(ctx, :loader, dataloader())
  end
end
