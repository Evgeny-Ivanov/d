module Helpers
	function convert_julia_chart_arr_in_js_arr(u, index)
		# ничкго полезного, просто преобразует данные возвращаемые
		# библиотечкой для интегрирования, в более удобный для дальнейшего использования вид
		result_arr = Float64[]
		for i in 1:length(u)
			push!(result_arr, u[i][index])
		end
		return result_arr
	end

	function find_first_item(arr, item, last_index)
		# функция находящая индекс первого элемента массива arr, большего чем item
		for i in last_index:length(arr)
			if arr[i] >= item
				return i
			end
		end
		return length(arr)
	end

	export convert_julia_chart_arr_in_js_arr, find_first_item
end