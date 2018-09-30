module Helpers
	function convert_julia_chart_arr_in_js_arr(u, index)
		result_arr = Float64[]
		for i in 1:length(u) - 1
			push!(result_arr, u[i][index])
		end
		return result_arr
	end

	function find_first_item(arr, item, last_index)
		for i in last_index:length(arr) - 1
			if arr[i] >= item
				return i
			end
		end
		return length(arr - 1)
	end

	export convert_julia_chart_arr_in_js_arr, find_first_item
end