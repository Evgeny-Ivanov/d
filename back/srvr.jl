push!(LOAD_PATH, ".")

using JuliaWebAPI: process, create_responder
using GasEngine: cal_gas_engine
using Vibration: cal_vibration_with_gas_engine, cal_var_vibration


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


# Expose functions via a ZMQ listener
process(create_responder([
	(cal_vibration_with_gas_engine_api, false),
	(cal_var_vibration_api, false),
	(cal_gas_engine_api, false)
], 
	"tcp://127.0.0.1:9999",
	true,
	""
))