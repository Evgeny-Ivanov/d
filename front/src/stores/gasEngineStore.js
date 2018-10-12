import {action, observable} from 'mobx';
import axios from 'axios';
// import { execJuliaScript, execJuliaScriptRpc } from '../helpers';

export const μMap = {
    izhevsk: 1,
    kirillov: 2,
    orlov: 3,
};

class GasEngineStore {
    @observable isLoading;

    @observable charts;

    @observable vars;

    @observable input = {
        l_д: 0.62 - 52.07 * 10 ** -3,

        ψ: 90 - 26 + 90, // угол наклона газового отверстия, в градусах
        d_ц: 9.5, // диаметр газовой трубки, мм
        d_п: 9.46, // диаметр поршня, мм
        d_0: 2.9, // диаметр газового отверстия, мм
        l_гп: 13.2, // длина газового отверстия, мм
        l_го: 347, // расстояние от казенного среза до газового отверстия, мм

        t_сх: 0.001, // время свободного хода, с
        t_отп: 0.0016, // время отпирания, с

        f: 1.05, // МДж/кг
        α_k: 0.95, // дм^3/кг
        k: 1.2,
        z_k: 1,
        κ: 1.173,
        λ: -0.145,
        δ: 1.6, // кг/дм^3
        I_k: 0.245, // МПа/с
        T_1: 2873, // К
        K_f: 0.0003,
        K_I: 0.0016,

        d: 7.62, // калибр, мм
        S: 47.99, // площадь канала ствола, мм^2
        ω: 3.25, // масса снаряда, г
        q: 9.6, // масса заряда, г
        W_км: 3.76, // объем каморы, см^3
        p_max_кр: 299, // Крешерное давление, МПа
        N_кр: 1.12, // Коэффициент крешера

        n: 4, // величина соотношения массы затвора и затворной рамы
        f_тр: 0.05, // коэффициент трения
        α: 45, // угол поворота выступов затвора при отпирании канала ствола, в градусах (α <= 60)
        r: 0.014, // радиус выступа затвора

        μFormula: μMap.orlov, // 1 -

        I_в: 77.84,
        T: 273 + 15,

        K: 1.03, // коэффициент учета второстепенных работ

        σ_T: 360, // постоянная коэффициента теплоотдачи
        ν_T: 0.7, // относительная разность температур газа и стенки

        p_всп: 5, // Давление вспышки, МПа
        p_0: 10, // Давление форсирования, МПа
    };

    convertToSI = () => {
        const {input} = this;
        return {
            ...input,

            d_ц: input.d_ц * 10.0 ** -3,
            d_п: input.d_п * 10.0 ** -3,
            d_0: input.d_0 * 10.0 ** -3,
            l_гп: input.l_гп * 10.0 ** -3,
            l_го: input.l_го * 10.0 ** -3,


            d: input.d * 10.0 ** -3,
            S: input.S * 10.0 ** -6,
            ω: input.ω * 10.0 ** -3,
            q: input.q * 10.0 ** -3,
            W_км: input.W_км * 10.0 ** -6,

            f: input.f * 10.0 ** 6,
            α_k: input.α_k * 10.0 ** -3,
            δ: input.δ * 10.0 ** 3,
            I_k: input.I_k * 10.0 ** 6,

            p_max_кр: input.p_max_кр * 10.0 ** 6,

            p_всп: input.p_всп * 10.0 ** 6,
            p_0: input.p_0 * 10.0 ** 6,
        };
    };

    constructor() {
        this.vars = {
            M_пч: '',
            E_потребная: '',
            V_пч_потребная: '',
            ν_зр_з: '',
            η_зс_с: '',
            M_пр1: '',
            M_пр2: '',
            M_пр3: '',
        };
        this.charts = {};
    }

    @action calculation = async () => {
        this.isLoading = true;
        try {
            const res = await axios.get('/cal_gas_engine_api/', {params: this.convertToSI()});
            this.vars = res.data.vars;
            this.charts = res.data.charts;
        } catch (e) {
            alert(`Ошибка: ${e.response.data}`);
        } finally {
            this.isLoading = false;
        }
    }
}

const gasEngineStore = new GasEngineStore();

export default gasEngineStore;
export {GasEngineStore};
