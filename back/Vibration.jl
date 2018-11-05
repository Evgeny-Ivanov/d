module Vibration
    include("GasEngine.jl")
    include("Helpers.jl")
    include("experiment_data.jl")

	import DataFrames, XLSX
	using .GasEngine: cal_gas_engine # импортируем из файл GasEngine функцию для расчета БГД
	using .Helpers: convert_julia_chart_arr_in_js_arr, find_first_item
	using .experiment_data: p_г_э, t_г_э, tp, pk10 ,pk70 ,pk140 ,pk210 ,pk280 ,pk350 ,pk430 ,pk510 ,pk570 # импортирум массивы экспериментальных данных

	function cal_vibration_with_gas_engine(; # расчет задачи коллебаний для одного положения камеры вместе и БГД
		d = required, # внутренний диаметр ствола
		l_го = required, # положение газовой камеры
		l_д = required, # длина ствола
		d_п = required, # диаметр поршня

		e = required, # модуль Юнга, МПа
		ro = required, # плотность,кг/м³
		d1 = required, # наружный диаметр ствола, мм
		q1 = required, # кг, масса газовой каморы
		q2 = required, # кг, масса надульного устройства
		gp = required, # г, масса пули
		cit = required, # соотношение между шагом по времени и координате
		h_г = required, # мм, плечо момента от силы газовой каморы
		n_dx = required, # на сколько точек по координате разделять длину ствола
		kwargs... # остальные переменные, необходимы для решения бгд
		)
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
			xl0 = l_д, # длина ствола
			q1 = q1, # массса газовой камеры
			q2 = q2, # масса надульного устройства
			gp = gp,
			cit = cit, # соотношение между шагом по времени и координате
			d_п = d_п, # диаметр поршня
			h_г = h_г,
			n = Int(n_dx)
		)
		return result2
	end

	function cal_vibration(; # расчет задачи коллебаний для одного положения газовой камеры
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
		xl0 = required, # длина ствола
		q1 = required, # массса газовой камеры
		q2 = required, # масса надульного устройства
		gp = required, # масса пули
		cit = required, # соотношение между шагом по времени и координате
		d_п = required, # диаметр поршня
		h_г = required, # плечо момента от силы газовой каморы
		n = required
		)
		cal_type = 3
		APPROX_CAL = 1
		EXPER_СAL = 2
		NUMER_CAL = 3

		with_gas_engine = true

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
		y_anim = Array{Float64}[] # массив резултатов для построения анимации коллебаний
		y_stationary = Array{Float64}(undef, n1) # массив резултатов для стационарного прогиба
		x_stationary = Array{Float64}(undef, n1) # массив резултатов для стационарного прогиба


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
		cm = ro * pi * (d1^2 - d0^2) / 4. # видимо масса на единицу длины ствола

		for i in 1:n1 
			q[i]=cm
		end

		q[nm1] = cm + q2 / dx
		im2 = floor(Int, xm1 / dx) + 1 # тут возможно округляется не в ту сторону, в которую надо
		q[im2] = cm + q1 / dx
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

			if xp >= xm1 # если коорданата пули больше положения камеры (начался отвод газов)
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
				if with_gas_engine
					fp[im2-1] = fp[im2-1] - qmom
					fp[im2+1] = fp[im2+1] + qmom
				end
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

			if flag == 200 # результатов очень много, и сохраняем только каждую 200ю
				o = (y[n1]-y[n1-1])/(1*dx) * 57.2958 # находим угол наклона дульного среза (6 - для того что бы график был более гладким)

				if length(y_res) > 0
					push!(v_res, (y[n1] - y_res[end]) / (t - t_res[end]))
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

# 			if t > 0.0013
# 				break
# 			end

			if xp > xl0
				break
			end
		end


# 		print("XLSX writetable process")

# 		df = DataFrames.DataFrame(x_stationary=x_stationary, y_stationary=y_stationary, y_t_выл=y_anim[end])
# 		XLSX.writetable("res_stat.xlsx", DataFrames.columns(df), DataFrames.names(df))

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


	function cal_var_vibration(; # функция расчета коллебаний для разных положений газовой камеры
		n_dx_г = required, # количество положений газовой камеры, для которых будет считаться задача коллебаний
		l_д = required, # длина ствола
		kwargs... # остальные переменные, необходимы для решения бгд
		)
		is_save_file = false
		x_res = Float64[] # массив положений газовой камеры
		o_res = Float64[] # массив углов наклона дульного среза
		y_res = Float64[] # массив отклонений дульного среза

		file = open(".percent", "w")

		xm1 = 0.02 # начальное положение для газовой камеры (для xm1=0 не считает)
		dx = l_д / Int(n_dx_г) # шаг, для варьирования положения газовой каморы
		i = 0
		flag = true
		while xm1 <= l_д # перебираем положения газовой камеры
			print("$i ")
			result = cal_vibration_with_gas_engine(;kwargs..., l_го=xm1, l_д=l_д) # считаем коллебания для текущего положения газовой камеры
			push!(x_res, xm1)
			push!(o_res, result["o"][end]) # result["o"][end] - берет o для дульного среза (end)
			push!(y_res, result["y"][end]) # result["н"][end] - берет y для дульного среза (end)
			xm1 += dx
			if flag && xm1 > l_д
				flag = false
				xm1 = l_д - 0.002
			end
			i += 1
			seekstart(file)

			write(file, "$(round(Int8, i * 100 / n_dx_г ))")
		end

		close(file)

		if is_save_file
			df = DataFrames.DataFrame(x=x_res, y=y_res, o=o_res)
			XLSX.writetable("res.xlsx", DataFrames.columns(df), DataFrames.names(df))
		end

		return Dict(
			"x" => x_res,
			"y" => y_res,
			"o" => o_res
		)
	end

export cal_var_vibration, cal_vibration_with_gas_engine # даем возможность использовать эти функции в других файлах
end