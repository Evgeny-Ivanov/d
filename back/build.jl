using PackageCompiler

build_executable(
    "srvr.jl", # Julia script containing a `julia_main` function, e.g. like `examples/hello.jl`
    # snoopfile = "call_functions.jl", # Julia script which calls functions that you want to make sure to have precompiled [optional]
    builddir = "build" # that's where the compiled artifacts will end up [optional]
)