defmodule Mix.Tasks.GenerateGraphModel do
  use Mix.Task

  require IEx

  def run([name]) do
    app_dir = File.cwd!()
    app_name = Path.basename(app_dir)
    root_folder = "#{app_dir}/lib/#{app_name}/#{name}"
    File.mkdir(root_folder)

    formatted_app_name =
      app_name |> String.split("_") |> Enum.map(&String.capitalize(&1)) |> Enum.join()

    module_name = Macro.camelize(name)

    task1 =
      Task.async(fn ->
        File.write(
          "#{root_folder}/#{name}_schema.ex",
          """
          defmodule #{formatted_app_name}.#{module_name}.#{module_name}Schema do
            @moduledoc false

            use Absinthe.Schema.Notation
            use Absinthe.Relay.Schema.Notation, :modern

            import Absinthe.Resolution.Helpers

            object :#{name} do
              field(:id, non_null(:id))
            end

            connection(node_type: :#{name})

            object :#{name}_queries do
            end

            object :#{name}_mutations do
            end
          end
          """,
          [:write]
        )
      end)

    task2 =
      Task.async(fn ->
        File.write(
          "#{root_folder}/#{name}_resolver.ex",
          """
          defmodule #{formatted_app_name}.#{module_name}.#{module_name}Resolver do

          end
          """,
          [:write]
        )
      end)

    task3 =
      Task.async(fn ->
        File.write(
          "#{root_folder}/#{name}_context.ex",
          """
          defmodule #{formatted_app_name}.#{module_name}.#{module_name}Context do
            @moduledoc false

            alias #{formatted_app_name}.Repo

            # Dataloader functions
            def data() do
              Dataloader.Ecto.new(Repo, query: &query/2)
            end

            def query(queryable, _) do
              queryable
            end
          end
          """,
          [:write]
        )
      end)

    task4 =
      Task.async(fn ->
        File.write(
          "#{root_folder}/#{name}_service.ex",
          """
          defmodule #{formatted_app_name}.#{module_name}.#{module_name}Service do

          end
          """,
          [:write]
        )
      end)

    task5 =
      Task.async(fn ->
        File.write(
          "#{root_folder}/#{name}.ex",
          """
          defmodule #{formatted_app_name}.#{module_name}.#{module_name} do
            @moduledoc false

            use Ecto.Schema

            import Ecto.Changeset
            import Ecto.Query

            @primary_key {:id, UUIDv7, autogenerate: true}

            schema "#{name}" do

            end
          end
          """,
          [:write]
        )
      end)

    Task.await_many([task1, task2, task3, task4, task5])
  end
end
