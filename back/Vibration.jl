module Vibration
	using GasEngine: cal_gas_engine
	using Helpers: convert_julia_chart_arr_in_js_arr, find_first_item
	using experiment_data: p_г_э, t_г_э

	function cal_vibration_with_gas_engine(;
		d = required, 
		l_го = required, 
		l_д = required,
		d_п = required, 

		e = required, 
		ro = required,
		d1 = required,
		q1 = required,
		q2 = required,
		gp = required,
		cit = required,
		h_г = required,
		n_dx = required,
		kwargs...
		)
		result1 = cal_gas_engine(;
			kwargs...,
			d = d, 
			l_го = l_го, 
			l_д = l_д,
			d_п = d_п
		)

		u = result1["charts"]["u"]
		t = result1["charts"]["t"]
		p = convert_julia_chart_arr_in_js_arr(u, 1)
		v = convert_julia_chart_arr_in_js_arr(u, 5)
		l = convert_julia_chart_arr_in_js_arr(u, 6)
		p_п = convert_julia_chart_arr_in_js_arr(u, 11)

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

	function cal_vibration(;
		t_ = required,
		p_ = required,
		v_ = required,
		l_ = required,
		p_п_ = required,

		xm1 = required,
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
		y = Array{Float64}(undef, 5000)
		v = Array{Float64}(undef, 5000)
		y1 = Array{Float64}(undef, 5000)
		q = Array{Float64}(undef, 5000)
		f = Array{Float64}(undef, 5000)
		fm = Array{Float64}(undef, 5000)
		u = Array{Float64}(undef, 5000)
		fp = Array{Float64}(undef, 5000)
		y_stationary = Array{Float64}(undef, 5000)
		x_stationary = Array{Float64}(undef, 5000)


		t_res = Float64[]
		o_res = Float64[]
		y_res = Float64[]

		g0 = 9.8

		S_п = 3.14 * (d_п^2) / 4 # площадь поршня

		n1 = n + 1
		nm1 = n - 1
		dx = xl0 / n
		dx2 = dx^2
		dx4 = dx^4
		dt = cit * dx / 1.e+7
		ci = pi * (d1^4 - d0^4) / 32. # осевой момент инерции сечения ствола
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
		end

		y[1]=0.
		y_stationary[1] = y[1]
		x_stationary[1] = 0
		for i in 1:n
			y[i+1]=y[i]+0.5*(u[i]+u[i+1])*dx
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
		asdf = 0
		while true
			for i in 1:n1
				fp[i]=0.
			end

			cf=0.
			t_last_index = find_first_item(t_, t, t_last_index)
			vp = v_[t_last_index] # текущая скорость пули
			xp = l_[t_last_index] # текущая координата пули

			# приближенный расчет 
			# tau = 0.35e-3
			# v0 = 830
			# vp = v0 * (1. - exp(-t / tau))
			# xp = v0 * (t - tau * (1. -exp(-t / tau)))

			if xp < xl0
				ip=floor(Int, xp/dx)+1
				if ip >= 2 && ip < n
					y2=0.5*((y[ip+1]-2.0*y[ip]+y[ip-1])+(y[ip+2]-2.0*y[ip+1]+y[ip]))/dx2
					cf=gp*vp^2*y2 # центробежная сила
					fp[ip]=0.5*cf/dx
					fp[ip+1]=fp[ip]
				end
			end

			if xp >= xm1
				p_п = p_п_[t_last_index] # давление в газовой каморе

				# эксперимент
				if p_п > 0
					if asdf == 0
						t_start = t
						asdf = 1
					end
					index = find_first_item(t_г_э, t*10.0^3 - t_start*10.0^3, 1)
					p_п = p_г_э[index] # давление в газовой каморе
					p_п = p_п * 10.0^5
				end
				# приближенный расчет
				# p_п = 4 * 10^6
				cme = p_п * S_п * h_г
				qmom = 0.5 * cme / dx2 
				fp[im2-1] = fp[im2-1] - qmom
				fp[im2+1] = fp[im2+1] + qmom
			end

			y[n1]=3.0*y[nm1]-2.0*y[n-2]
			y[n]=2.0*y[nm1]-y[n-2]


			for i in 3:nm1 # тут и происходит основной расчет по разностной схеме
				v1=v[i]
				v[i]=v1-dt*(ei*(y[i+2]-4.0*y[i+1]+6.0*y[i]-4.0*y[i-1]+y[i-2])/dx4/q[i]+g0+fp[i]/q[i])
				y1[i]=y[i]+dt*(v1+v[i])/2.
			end 

			for i in 3:nm1
				y[i]=y1[i]
			end

			if flag == 50
				o = (y[n]-y[n-6])/(6*dx) * 57.2958
				push!(o_res, o)
				push!(t_res, t)
				push!(y_res, y[n])


				flag = 0
			end
			
			t = t + dt
			flag += 1
			
			if xp > xl0
				break 
			end			
		end

		return Dict(
			"t" => t_res,
			"y" => y_res,
			"o" => o_res,

			"y_stationary" => y_stationary,
			"x_stationary" => x_stationary,
		)
	end


	function cal_var_vibration(;
		n_dx_г = required,
		l_д = required,
		kwargs...
		)
		x_res = Float64[]
		o_res = Float64[]
		y_res = Float64[]

		file = open(".percent", "w")

		xm1 = 0.02
		dx = l_д / Int(n_dx_г) # шаг, для варьирования положения газовой каморы
		i = 0
		while xm1 < l_д
			print("$i ")
			result = cal_vibration_with_gas_engine(;kwargs..., l_го=xm1, l_д=l_д)
			push!(x_res, xm1)
			push!(o_res, result["o"][end])
			push!(y_res, result["y"][end])
			xm1 += dx
			i += 1
			seekstart(file)

			write(file, "$(round(Int8, i * 100 / n_dx_г ))")
		end

		close(file)

		return Dict(
			"x" => x_res,
			"y" => y_res,
			"o" => o_res
		)
	end

export cal_var_vibration, cal_vibration_with_gas_engine
end