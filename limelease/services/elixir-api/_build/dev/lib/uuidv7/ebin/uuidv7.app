{application,uuidv7,
             [{compile_env,[{rustler_precompiled,[force_build,uuidv7],error}]},
              {optional_applications,[rustler]},
              {applications,[kernel,stdlib,elixir,logger,ecto,rustler,
                             rustler_precompiled]},
              {description,"A UUID v7 implementation and Ecto.Type for Elixir - based on Rust"},
              {modules,['Elixir.UUIDv7','Elixir.UUIDv7.Type']},
              {registered,[]},
              {vsn,"0.2.1"}]}.
