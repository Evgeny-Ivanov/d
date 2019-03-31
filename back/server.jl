module Server
    include("GasEngine.jl")
    include("Vibration.jl")
    include("Ballistics.jl")

    using JuliaWebAPI: process, create_responder, APIInvoker, run_http
    using .GasEngine: cal_gas_engine, cal_gas_engine_var
    using .Vibration: cal_vibration_with_gas_engine, cal_var_vibration, cal_var_vibration_l
    using .Ballistics: cal_ballistics_for_3_t, cal_rationale_l

    function convert_to_Float64(args...; kwargs...)
       newkwargs = []
       newargs = []
       for i = kwargs
           push!(newkwargs, (i[1], parse(Float64, i[2])))
       end

       for i = args
           push!(newargs, parse(Float64, i))
       end

       return newargs, newkwargs
    end


    function cal_vibration_with_gas_engine_api(args...; kwargs...)
        newargs, newkwargs = convert_to_Float64(args...; kwargs...)
        cal_vibration_with_gas_engine(newargs...; newkwargs...)
    end

    function cal_var_vibration_api(args...; kwargs...)
        newargs, newkwargs = convert_to_Float64(args...; kwargs...)
        cal_var_vibration(newargs...; newkwargs...)
    end

    function cal_gas_engine_api(args...; kwargs...)
        newargs, newkwargs = convert_to_Float64(args...; kwargs...)
        cal_gas_engine(newargs...; newkwargs...)
    end

    function cal_ballistics_for_3_t_api(args...; kwargs...)
        newargs, newkwargs = convert_to_Float64(args...; kwargs...)
        cal_ballistics_for_3_t(newargs...; newkwargs...)
    end

    function cal_rationale_l_api(args...; kwargs...)
        newargs, newkwargs = convert_to_Float64(args...; kwargs...)
        cal_rationale_l(newargs...; newkwargs...)
    end

    function cal_gas_engine_var_api(args...; kwargs...)
        newargs, newkwargs = convert_to_Float64(args...; kwargs...)
        cal_gas_engine_var(newargs...; newkwargs...)
    end

    function cal_var_vibration_l_api(args...; kwargs...)
        newargs, newkwargs = convert_to_Float64(args...; kwargs...)
        cal_var_vibration_l(newargs...; newkwargs...)
    end

    function start_ZMQ_client()
        #Create the ZMQ client that talks to the ZMQ listener above
        apiclnt = APIInvoker("tcp://127.0.0.1:9999");

        #Starts the HTTP server in current process
        println("start ZMQ client")
        run_http(apiclnt, 8887)
    end

    function start_ZMQ_listener()
        # Expose functions via a ZMQ listener
        println("start ZMQ listener")
        process(create_responder([
            (cal_vibration_with_gas_engine_api, false),
            (cal_var_vibration_api, false),
            (cal_gas_engine_api, false),
            (cal_ballistics_for_3_t_api, false),
            (cal_rationale_l_api, false),
            (cal_gas_engine_var_api, false),
            (cal_var_vibration_l_api, false)
        ],
            "tcp://127.0.0.1:9999",
            true,
            ""
        ))
    end

    Base.@ccallable function julia_main(ARGS::Vector{String})::Int32
        @async start_ZMQ_client()
        start_ZMQ_listener()
        return 0
    end

    if PROGRAM_FILE == "server.jl"
        julia_main(Array{String,1}(undef, 0))
    end
end