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

	function get_d1_mosin(x) # mos
		r_ств_окр(r_ств_конца, r_окр, x_цен_окр, x) = r_ств_конца + r_окр - sqrt(r_окр^2 - (x_цен_окр - x)^2)
		r_ств_тр(r_нач, r_кон, x_нач, x_кон, x) = r_кон - (r_кон - r_нач) * (x - x_нач) / (x_кон - x_нач)

		x = (800 * 10 ^ (-3) - xl0) + x
		if 0 <= x < 2.4339 * 10 ^ (-3)
			return 2 * 11.4 * 10 ^ (-3)
		end
		if 2.4339 * 10 ^ (-3) <= x < 23.65 * 10 ^ (-3)
			return 2 * 12.42 * 10 ^ (-3)
		end
		if 23.65 * 10 ^ (-3) <= x < 73.66 * 10 ^ (-3)
			return 2 * r_ств_тр(14.986 * 10 ^ (-3), 13.97 * 10 ^ (-3), 23.65 * 10 ^ (-3), 73.66 * 10 ^ (-3), x)
		end
		if  73.66 * 10 ^ (-3) <= x < 83.82 * 10 ^ (-3)
			return r_ств_окр(9.81 * 10 ^ (-3), 14.122 * 10 ^ (-3), 83.58 * 10 ^ (-3), x)
		end
		if 83.82 * 10 ^ (-3) <= x < 798.19 * 10 ^ (-3)
			return 2 * r_ств_тр(9.91 * 10 ^ (-3), 7.43 * 10 ^ (-3), 83.82 * 10 ^ (-3), 798.19 * 10 ^ (-3), x)
		end
		if 798.19 * 10 ^ (-3) <= x < 800 * 10 ^ (-3)
			return 2 * r_ств_окр(5.52 * 10 ^ (-3), 1.905 * 10 ^ (-3), x, 798.19 * 10 ^ (-3))
		end
		if x >= 800 * 10 ^ (-3)
			return 2 * 5.52 * 10 ^ (-3)
		end
	end

	export get_d1_mosin
end