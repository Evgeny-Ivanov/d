import { action, observable } from 'mobx';
import axios from 'axios';
import gasEngineStore from './gasEngineStore';
import { showError } from '../helpers';

class BallisticsStore {
  @observable isLoading;

  @observable forM50;
  @observable for15;
  @observable for50;
  @observable rationaleLRes;

  convertToSI = () => {
    const { input } = gasEngineStore;
    return  {
      l_д: input.l_д,

      d: input.d * 10.0 ** -3,
      S: input.S * 10.0 ** -6,
      ω: input.ω * 10.0 ** -3,
      q: input.q * 10.0 ** -3,
      W_км: input.W_км * 10.0 ** -6,

      f: input.f * 10.0 ** 6,
      k: input.k,
      z_k: input.z_k,
      κ: input.κ,
      λ: input.λ,
      α_k: input.α_k * 10.0 ** -3,
      δ: input.δ * 10.0 ** 3,
      I_k: input.I_k * 10.0 ** 6,
      T_1: input.T_1,
      K_f: input.K_f,
      K_I: input.K_I,
      T: input.T,
      K: input.K,
      σ_T: input.σ_T,
      ν_T: input.ν_T,

      p_всп: input.p_всп * 10.0 ** 6,
      p_0: input.p_0 * 10.0 ** 6,
    };
  };

  @action calculation = async () => {
    this.isLoading = true;
    try {
      const res = await axios.get('/cal_ballistics_for_3_t_api/', { params: this.convertToSI() });
      this.forM50 = res.data.for_m50;
      this.for15 = res.data.for_15;
      this.for50 = res.data.for_50;
    } catch (e) {
      alert(`Ошибка: ${e.response.data}`);
    } finally {
      this.isLoading = false;
    }
  };

  @action calculationRationaleL = async () => {
    this.isLoading = true;
    let params = {...this.convertToSI()};
    delete params.l_д;
    try {
      const res = await axios.get('/cal_rationale_l_api/', { params: params });
      this.rationaleLRes = res.data;
      console.log(res.data);
    } catch (e) {
      alert(`Ошибка: ${e.response.data}`);
    } finally {
      this.isLoading = false;
    }
  }
}

const ballisticsStore = new BallisticsStore();

export default ballisticsStore;
export { BallisticsStore };
