module Vibration
    include("GasEngine.jl")
    include("Helpers.jl")
    include("experiment_data.jl")

	import DataFrames, XLSX
	using .GasEngine: cal_gas_engine # импортируем из файл GasEngine функцию для расчета БГД
	using .Helpers: convert_julia_chart_arr_in_js_arr, find_first_item
	using .experiment_data: p_г_э, t_г_э, tp, pk10 ,pk70 ,pk140 ,pk210 ,pk280 ,pk350 ,pk430 ,pk510 ,pk570 # импортирум массивы экспериментальных данных

	function cal_vibration_with_gas_engine(; # расчет задачи колебаний для одного положения камеры вместе и БГД
		d = required, # внутренний диаметр ствола
		l_го = required, # положение газовой камеры
		l_д = required, # длина ствола
		d_п = required, # диаметр поршня

		e = required, # модуль Юнга, МПа
		ro = required, # плотность,кг/м³
		d1 = required, # наружный диаметр ствола, мм
        d2 = 0, # наружный диаметр ствола, мм
        var_d = false,
		q1 = required, # кг, масса газовой каморы
		q2 = required, # кг, масса надульного устройства
		gp = required, # г, масса пули
		cit = required, # соотношение между шагом по времени и координате
		h_г = required, # мм, плечо момента от силы газовой каморы
		n_dx = required, # на сколько точек по координате разделять длину ствола
        with_gas_engine = required,
		kwargs... # остальные переменные, необходимы для решения бгд
		)
        println("cal_vibration_with_gas_engine")
		result1 = cal_gas_engine(; # считаем задачу БГД
			kwargs...,
			d = d,
			l_го = l_го,
			l_д = l_д,
			d_п = d_п
		)

		# распаковываем результаты расчета БГД, для дальнейшего использования
		u = result1["charts"]["u"]
		t = result1["charts"]["t"]
		p = convert_julia_chart_arr_in_js_arr(u, 1) # convert_julia_chart_arr_in_js_arr - просто приводит данные к такому ввиду, который нам нужен дальше
		v = convert_julia_chart_arr_in_js_arr(u, 5)
		l = convert_julia_chart_arr_in_js_arr(u, 6)
		p_п = convert_julia_chart_arr_in_js_arr(u, 11) # давление в газовой камере

		result2 = cal_vibration(
			t_ = t,
			p_ = p,
			v_ = v,
			l_ = l,
			p_п_ = p_п,

			xm1 = l_го,
			e = e, 
			ro = ro,
			d0 = d, # внутренний диаметр ствола
			d1 = d1,
            d2 = d2,
            var_d = var_d,
			xl0 = l_д, # длина ствола
			q1 = q1, # массса газовой камеры
			q2 = q2, # масса надульного устройства
			gp = gp,
			cit = cit, # соотношение между шагом по времени и координате
			d_п = d_п, # диаметр поршня
			h_г = h_г,
			n = Int(n_dx),
            with_gas_engine = with_gas_engine
		)
		return result2
	end

	function cal_vibration(; # расчет задачи колебаний для одного положения газовой камеры
		t_ = required, # результаты расчета бгд
		p_ = required, # результаты расчета бгд
		v_ = required, # результаты расчета бгд
		l_ = required, # результаты расчета бгд
		p_п_ = required, # результаты расчета бгд

		xm1 = required, # положение газовой камеры
		e = required, # модуль Юнга 
		ro = required, # плотность материала ствола
		d0 = required, # внутренний диаметр ствола
		d1 = required, # наружный диаметр ствола
        d2 = 0, # наружный диаметр ствола
        var_d = false,
		xl0 = required, # длина ствола
		q1 = required, # массса газовой камеры
		q2 = required, # масса надульного устройства
		gp = required, # масса пули
		cit = required, # соотношение между шагом по времени и координате
		d_п = required, # диаметр поршня
		h_г = required, # плечо момента от силы газовой каморы
        with_gas_engine = required,
		n = required
		)
        println("cal_vibration")

		cal_type = 3
		APPROX_CAL = 1
		EXPER_СAL = 2
		NUMER_CAL = 3

		if !Bool(with_gas_engine)
			q1 = 0.0
		end

		d0 = 8 * 10^(-3)
		d_п = 9 * 10^(-3)

		n1 = n + 1
		y = Array{Float64}(undef, n1)
		v = Array{Float64}(undef, n1)
		y1 = Array{Float64}(undef, n1)
		q = Array{Float64}(undef, n1)
		f = Array{Float64}(undef, n1)
		fm = Array{Float64}(undef, n1)
		u = Array{Float64}(undef, n1)
		fp = Array{Float64}(undef, n1)
		y_anim = Array{Float64}[] # массив резултатов для построения анимации колебаний
		y_stationary = Array{Float64}(undef, n1) # массив резултатов для стационарного прогиба
		x_stationary = Array{Float64}(undef, n1) # массив резултатов для стационарного прогиба
		prev_y = 0

		t_res = Float64[]
		o_res = Float64[]
		y_res = Float64[]
		v_res = Float64[]

		g0 = 9.8

		S_п = 3.14 * (d_п^2) / 4 # площадь поршня

		nm1 = n - 1
		dx = xl0 / n
		dx2 = dx^2
		dx4 = dx^4
		dt = cit * dx / 1.e+7
		ci = pi * (d1^4 - d0^4) / 64 # осевой момент инерции сечения ствола
		ei = e * ci


		r_ств_окр(r_ств_конца, r_окр, x_цен_окр, x) = r_ств_конца + r_окр - sqrt(r_окр^2 - (x_цен_окр - x)^2)
		r_ств_тр(r_нач, r_кон, x_нач, x_кон, x) = r_кон - (r_кон - r_нач) * (x - x_нач) / (x_кон - x_нач)

		function get_d1_svd(x)
	        x = (620 * 10 ^ (-3) - xl0) + x
			if 0 <= x < 10.5 * 10 ^ (-3)
				return 2 * 11.27 * 10 ^ (-3)
			end
			if 10.5 * 10 ^ (-3) <= x < 36 * 10 ^ (-3)
				return 2 * 12.52 * 10 ^ (-3)
			end
			if 36 * 10 ^ (-3) <= x < 64 * 10 ^ (-3)
				return 2 * 15.02 * 10 ^ (-3)
			end
			if 64 * 10 ^ (-3) <= x < 76.64 * 10 ^ (-3)
				return 2 * r_ств_окр(10.52 * 10 ^ (-3), 20  * 10 ^ (-3), 76.64 * 10 ^ (-3), x)
			end
			if 76.64 * 10 ^ (-3) <= x < 124 * 10 ^ (-3)
				return 2 * 10.52 * 10 ^ (-3)
			end
			if 124 * 10 ^ (-3) <= x < 129.19 * 10 ^ (-3)
				return 2 * r_ств_окр(9.07 * 10 ^ (-3), 10  * 10 ^ (-3), 129.19 * 10 ^ (-3), x)
			end
			if 129.19 * 10 ^ (-3) <= x < 313 * 10 ^ (-3)
				return 2 * 9.07 * 10 ^ (-3)
			end
			if 313 * 10 ^ (-3) <= x < 313.95 * 10 ^ (-3)
				return 2 * r_ств_тр(9.07 * 10 ^ (-3), 8.52 * 10 ^ (-3), 313 * 10 ^ (-3), 313.95 * 10 ^ (-3), x)
			end
			if 313.95 * 10 ^ (-3) <= x < 370 * 10 ^ (-3)
				return 2 * 8.52 * 10 ^ (-3)
			end
			if 370 * 10 ^ (-3) <= x < 370.2 * 10 ^ (-3)
				return 2 * r_ств_тр(8.52 * 10 ^ (-3), 8.32 * 10 ^ (-3), 370 * 10 ^ (-3), 370.2 * 10 ^ (-3), x)
			end
			if 370.2 * 10 ^ (-3) <= x < 407 * 10 ^ (-3)
				return 2 * 8.32 * 10 ^ (-3)
			end
			if 407 * 10 ^ (-3) <= x < 407.31 * 10 ^ (-3)
				return 2 * r_ств_окр(8.27 * 10 ^ (-3), 1  * 10 ^ (-3), 407.31 * 10 ^ (-3), x)
			end
			if 407.31 * 10 ^ (-3) <= x < 578 * 10 ^ (-3)
				return 2 * 8.27 * 10 ^ (-3)
			end
			if 578 * 10 ^ (-3) <= x < 578.6 * 10 ^ (-3)
				return 2 * r_ств_окр(8.07 * 10 ^ (-3), 1  * 10 ^ (-3), 578.6 * 10 ^ (-3), x)
			end
			if 578.6 * 10 ^ (-3) <= x < 617.39 * 10 ^ (-3)
				return 2 * 8.07 * 10 ^ (-3)
			end
			if 617.39 * 10 ^ (-3) <= x <= 620 * 10 ^ (-3)
				return 2 * r_ств_тр(8.07 * 10 ^ (-3), 7.05  * 10 ^ (-3), 617.39 * 10 ^ (-3), 620  * 10 ^ (-3), x)
			end

            return 2 * r_ств_тр(8.07 * 10 ^ (-3), 7.05  * 10 ^ (-3), 617.39 * 10 ^ (-3), 620  * 10 ^ (-3), 620 * 10 ^ (-3))
        end

        function get_d1(x)
            if var_d
                return d1 - (x/xl0) * (d1 - d2)
            else
                return get_d1_svd(x)
            end
        end

		cm(x) = ro * pi * (get_d1(x)^2 - d0^2) / 4. # видимо масса на единицу длины ствола

		for i in 1:n1
			q[i]=cm(i * dx - dx / 2)
			a = q[i]
		end

		q[nm1] = cm(nm1 * dx - dx / 2) + q2 / dx
		im2 = floor(Int, xm1 / dx) + 1 # тут возможно округляется не в ту сторону, в которую надо
		q[im2] = cm(im2 * dx - dx / 2) + q1 / dx
		q[n] = 0.
		q[n1] = 0.

		# расчет стационарного прогиба оси ствола
		f[n1] = 0.
		for i in 1:n
			f[n1-i] = f[n1 - i + 1] + 0.5 * (q[n1 - i] + q[n1 - i + 1]) * g0 * dx
		end

		fm[n1]=0.
		for i in 1:n
			fm[n1-i]=fm[n1-i+1]-0.5*(f[n1-i]+f[n1-i+1])*dx
		end

		u[1]=0.
		for i in 1:n
			u[i+1]=u[i]+0.5*(fm[i]+fm[i+1])*dx/ei
			# u[i+1]=u[i]+fm[i+1]*dx/ei # matlab
		end

		y[1]=0.
		y_stationary[1] = y[1]
		x_stationary[1] = 0
		for i in 1:n
			y[i+1] = y[i]+0.5*(u[i]+u[i+1])*dx
			# y[i+1] = y[i]+u[i]*dx # matlab
			y_stationary[i+1] = y[i+1]
			x_stationary[i+1] = x_stationary[i] + dx
		end

		# задание начальной скорости сечений ствола
		for i in 1:n1
			v[i] = 0.
		end


		t = 0.
		flag = 0
		t_last_index = 1
		t_start = 0
		bgd_start_flag = 0
		while true
			for i in 1:n1
				fp[i]=0.
			end

			cf=0.

			vp = 0.0
			xp = 0.0

			if cal_type == EXPER_СAL || cal_type == NUMER_CAL
				t_last_index = find_first_item(t_, t, t_last_index) # вспомогательная функция, находящая индекс массива результатов БГД для текущего t
				vp = v_[t_last_index] # текущая скорость пули
				xp = l_[t_last_index] # текущая координата пули

				if vp == v_[end] && xp == l_[end]
					vp = 0
					xp = 2
				end
			end

			# приближенный расчет
			if cal_type == APPROX_CAL
				tau = 0.35e-3
				v0 = 830
				vp = v0 * (1. - exp(-t / tau))
				xp = v0 * (t - tau * (1. -exp(-t / tau)))
			end

			if xp < xl0
				ip=floor(Int, xp/dx)+1
				if ip >= 2 && ip < n
					y2=0.5*((y[ip+1]-2.0*y[ip]+y[ip-1])+(y[ip+2]-2.0*y[ip+1]+y[ip]))/dx2
					cf=gp*vp^2*y2 # центробежная сила
					fp[ip]=0.5*cf/dx
					fp[ip+1]=fp[ip]
				end
			end

			if xp >= xm1 && Bool(with_gas_engine) # если коорданата пули больше положения камеры (начался отвод газов)
				# численный
				p_п = p_п_[t_last_index] # давление в газовой каморе

				# эксперимент
				if cal_type == EXPER_СAL
					if p_п > 0
						if bgd_start_flag == 0
							t_start = t # запоминаем время начала отвода газов
							bgd_start_flag = 1 # что бы опять не войти в этот блок
						end
						index = find_first_item(t_г_э, t*10.0^3 - t_start*10.0^3, 1)
						p_п = p_г_э[index] # давление в газовой каморе
						p_п = p_п * 10.0^5
					end
				end

				# приближенный расчет
				if cal_type == APPROX_CAL
					p_п = 10.5 * 10^6
				end

				cme = p_п * S_п * h_г
				qmom = 0.5 * cme / dx2 # сила от изгибающего момента
                fp[im2-1] = fp[im2-1] - qmom
                fp[im2+1] = fp[im2+1] + qmom
			end

			y[n1]=3.0*y[nm1]-2.0*y[n-2]
			y[n]=2.0*y[nm1]-y[n-2]

# 			y[1]=0
# 			y[2]=0.5*(y[1]-y[3])
# 			if y[2]<=y[1]
# 				y[2]=y[1]
# 			end

			for i in 3:nm1 # тут и происходит основной расчет по разностной схеме
				v1=v[i]
				v[i]=v1-dt*(ei*(y[i+2]-4.0*y[i+1]+6.0*y[i]-4.0*y[i-1]+y[i-2])/dx4/q[i]+g0+fp[i]/q[i])
				y1[i]=y[i]+dt*(v1+v[i])/2.
			end 

			for i in 3:nm1
				y[i]=y1[i]
			end

			if flag == 1999
				prev_y = y[n1]
			end
			if flag == 2000 # результатов очень много, и сохраняем только каждую 200ю
				o = (y[n1]-y[n1-1])/(1*dx) * 57.2958 # находим угол наклона дульного среза (6 - для того что бы график был более гладким)

				if length(y_res) > 0
					push!(v_res, (y[n1] - prev_y) / dt)
				else
					push!(v_res, 0)
				end

				push!(o_res, o)
				push!(t_res, t)
				push!(y_res, y[n1])

# 				f_sum = Array{Float64}(undef, 500)
# 				for i in 1:n1
# 					f_sum[i]=q[i]+g0+fp[i]
# 				end

				push!(y_anim, copy(y))

				flag = 0
			end
			
			t = t + dt
			flag += 1

# 			if t > 0.003
# 				break
# 			end

			if xp > xl0
				break
			end
		end


# 		print("XLSX writetable process")

# 		df = DataFrames.DataFrame(x_stationary=x_stationary, y_stationary=y_stationary, y_t_выл=y_anim[end])
# 		XLSX.writetable("res_stat.xlsx", DataFrames.columns(df), DataFrames.names(df))
#
# 		df = DataFrames.DataFrame(t=t_res, y=y_res, o=o_res, v=v_res)
# 		XLSX.writetable("res_t.xlsx", DataFrames.columns(df), DataFrames.names(df))

		return Dict(
			"t" => t_res,
			"v" => v_res,
			"y" => y_res,
			"o" => o_res,
			"y_anim" => y_anim,

			"y_stationary" => y_stationary,
			"x_stationary" => x_stationary,
		)
	end


	function cal_var_vibration(; # функция расчета колебаний для разных положений газовой камеры
		n_dx_г = required, # количество положений газовой камеры, для которых будет считаться задача колебаний
		l_д = required, # длина ствола
		kwargs... # остальные переменные, необходимы для решения бгд
		)
		is_save_file = false
		x_res = Float64[] # массив положений газовой камеры
		o_res = Float64[] # массив углов наклона дульного среза
		y_res = Float64[] # массив отклонений дульного среза


		xm1 = 0.02 # начальное положение для газовой камеры (для xm1=0 не считает)
		dx = l_д / Int(n_dx_г) # шаг, для варьирования положения газовой каморы
		i = 0
		flag = true
		while xm1 <= l_д # перебираем положения газовой камеры
			print("$i ")
			result = cal_vibration_with_gas_engine(;kwargs..., l_го=xm1, l_д=l_д) # считаем колебания для текущего положения газовой камеры
			push!(x_res, xm1)
			push!(o_res, result["o"][end]) # result["o"][end] - берет o для дульного среза (end)
			push!(y_res, result["y"][end]) # result["н"][end] - берет y для дульного среза (end)
			xm1 += dx
			if flag && xm1 > l_д
				flag = false
				xm1 = l_д - 0.002
			end
			i += 1
		end


# 		if is_save_file
# 			df = DataFrames.DataFrame(x=x_res, y=y_res, o=o_res)
# 			XLSX.writetable("res.xlsx", DataFrames.columns(df), DataFrames.names(df))
# 		end

		return Dict(
			"x" => x_res,
			"y" => y_res,
			"o" => o_res
		)
	end


	function cal_var_vibration_l(;
		n_dx = required,
		l_д = required, # длина ствола
		kwargs... # остальные переменные, необходимы для решения бгд
		)
		is_save_file = false
		x_res = Float64[] # массив положений газовой камеры
		o_res = Float64[] # массив углов наклона дульного среза
		y_res = Float64[] # массив отклонений дульного среза


		xm1 = l_д / 2 # начальное положение для газовой камеры (для xm1=0 не считает)
		l_max = 2 * l_д
        dx = (l_max - xm1) / Int(n_dx) # шаг, для варьирования положения газовой каморы
		i = 0
		flag = true
		while xm1 <= l_max # перебираем положения газовой камеры
			print("$i ")
			result = cal_vibration_with_gas_engine(;kwargs..., l_д=xm1, n_dx=n_dx, l_го=0.02) # считаем колебания для текущего положения газовой камеры
			push!(x_res, xm1)
			push!(o_res, result["o"][end]) # result["o"][end] - берет o для дульного среза (end)
			push!(y_res, result["y"][end]) # result["н"][end] - берет y для дульного среза (end)
			xm1 += dx
			if flag && xm1 > l_max
				flag = false
				xm1 = l_max - 0.002
			end
			i += 1
		end


# 		if is_save_file
# 			df = DataFrames.DataFrame(x=x_res, y=y_res, o=o_res)
# 			XLSX.writetable("res.xlsx", DataFrames.columns(df), DataFrames.names(df))
# 		end

		return Dict(
			"x" => x_res,
			"y" => y_res,
			"o" => o_res
		)
	end


	function cal_var_vibration_d(;
        n_dx_d = required,
        d2 = required,
		d1 = required, # длина ствола
		kwargs... # остальные переменные, необходимы для решения бгд
		)

        is_reverse = d2 > d1

		is_save_file = false
		x_res = Float64[] # массив положений газовой камеры
		o_res = Float64[] # массив углов наклона дульного среза
		y_res = Float64[] # массив отклонений дульного среза


        d1x, d2x = min(d1, d2), min(d1, d2)

        aa = max(d1, d2)
        bb = min(d1, d2)

        dx = abs(d2 - d1) / Int(n_dx_d) # шаг, для варьирования положения газовой каморы
		i = 0
		flag = true
		while d1x <= max(d1, d2) && d2x <= max(d1, d2)
			print("$i")
			result = cal_vibration_with_gas_engine(;kwargs..., d1=d1x, d2=d2x, var_d=true) # считаем колебания для текущего положения газовой камеры
			push!(o_res, result["o"][end]) # result["o"][end] - берет o для дульного среза (end)
			push!(y_res, result["y"][end]) # result["н"][end] - берет y для дульного среза (end)
			if is_reverse
	            push!(x_res, d1x)
                d1x += dx
            else
                push!(x_res, d2x)
                d2x += dx
            end
			i += 1
		end


# 		if is_save_file
# 			df = DataFrames.DataFrame(x=x_res, y=y_res, o=o_res)
# 			XLSX.writetable("res.xlsx", DataFrames.columns(df), DataFrames.names(df))
# 		end

		return Dict(
			"x" => x_res,
			"y" => y_res,
			"o" => o_res
		)
	end


export cal_var_vibration, cal_vibration_with_gas_engine # даем возможность использовать эти функции в других файлах
end