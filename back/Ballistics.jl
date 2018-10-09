module Ballistics
    include("Constants.jl")

    using DifferentialEquations: ODEProblem, RK4, solve
    using .Constants: ρ_воздуха, p_а

    function cal_ballistics(; # функция расчета газового двигателя
        d = required, # калибр, м
        S = required, # м2
        l_д = required,
        ω = required, # кг
        q = required, # кг
        W_км = required, # м3

        # Параметры пороха
        f = required, # кДж/кг
        α_k = required, # дм^3/кг
        k = required,
        z_k = required,
        κ = required, # TODO ????
        λ = required,
        δ = required, # кг/дм^3
        I_k = required, # МПа/с
        T_1 = required, # К
        K_f = required,
        K_I = required,

        T = required, #

        K = required, # коэффициент учета второстепенных работ

        σ_T = required, # постоянная коэффициента теплоотдачи
        ν_T = required, # относительная разность температур газа и стенки

        p_всп = required, # Давление вспышки, МПа
        p_0 = required, # Давление форсирования, МПа
        τ = required,
    )
        μ = 0.95 # ???
        R = f / T_1
        A_1 = sqrt(k * (2 / (k + 1))^((k + 1) / (k - 1)))
        φ = K + ω / (3 * q)
        W_0 = W_км - ω / δ
        F_0 = 4 * (W_км / d)

        ξ_1(p, v) = (p >= p_0) || (v > 0) ? 1 : 0
        ξ_2(z) = (0 <= z <= z_k) ? 1 : 0
        ξ_3(l) = (l <= l_д) ? 1 : 0

        function direct_task_by_t(τ)
            f_τ = f * (1 + K_f * (τ - T))
            I_kτ = I_k * (1 - K_I * (τ - T))

            z_der(p, z) = p * ξ_2(z) / I_kτ
            Ψ_der(p, z) = κ * (1 + 2 * λ * z) * z_der(p, z)
            W_der(p, z, v, l) = ((ω * (1 - α_k * δ) * Ψ_der(p, z)) / δ + S * v) * ξ_3(l)
            G_д(p, W, w) = (μ * A_1 * p * S) / sqrt(complex((p * W) / w))
            F_охл(l) = 4 * W_км / d + l * π * d

            function ode(da, a, p, t)
                p, W, Ψ, z, v, l, w = a

                da[1] = (1 / W) * (
                        f_τ * ω * Ψ_der(p, z) -
                        (κ - 1) * σ_T * ν_T / R * F_охл(l) * p -
                        κ * p * W_der(p, z, v, l) -
                        (κ * p * W * G_д(p, W, w) * (1 - ξ_3(l))) / w
                )
                da[2] = W_der(p, z, v, l)
                da[3] = Ψ_der(p, z)
                da[4] = z_der(p, z)
                da[5] = (p * S * ξ_1(p, v) * ξ_3(l)) / (φ * q)
                da[6] = v * ξ_3(l)
                da[7] = ω * Ψ_der(p, z) - G_д(p, W, w) * (1 - ξ_3(l))

                return da
            end

        end

        init_u = [p_всп; W_0; 0; 0; 0; 0; S * l_д * ρ_воздуха]
        tspan = (0.0, 0.01)

        prob = ODEProblem(direct_task_by_t(τ), init_u, tspan)
        sol = solve(prob, RK4(), dt=10.0^-6)

        return Dict(
            "t" => sol.t,
            "u" => sol.u
        )
    end

    function cal_ballistics_for_3_t(;kwargs...)
        return Dict(
            "for_m50" => cal_ballistics(;τ=270 - 50, kwargs...),
            "for_15" => cal_ballistics(;τ=273 + 15, kwargs...),
            "for_50" => cal_ballistics(;τ=273 + 50, kwargs...),
        )
    end


    function cal_rationale_l(;kwargs...)
        l_д = 0.1
        l_д_step = 0.1
        l_д_max = 3
        result = Dict(
            "l" => Float64[],
            "v" => Float64[]
        )
        while l_д < l_д_max
            res = cal_ballistics(;l_д=l_д, τ=270 - 15, kwargs...)
            v = res["u"][end][5]
            print(v)
            push!(result["l"], l_д)
            push!(result["v"], v)
            l_д += l_д_step
        end

        return result
    end

    export cal_ballistics, cal_ballistics_for_3_t, cal_rationale_l
end