import { action, observable } from 'mobx';
import axios from 'axios';
import gasEngineStore from './gasEngineStore';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

class VibrationStore {
  @observable isLoading;

  @observable isLoadingVar;

  @observable percent;

  @observable charts = {};

  @observable varCharts = {};

  @observable input = {
    e: 200000, // модуль Юнга, МПа
    ro: 7800, // плотность,кг/м³
    d1: 20, // наружный диаметр ствола, мм
    q1: 0.1, // кг, масса газовой каморы
    q2: 0.2, // кг, масса надульного устройства
    gp: 9, // г, масса пули
    cit: 1, // соотношение между шагом по времени и координате
    h_г: 20, // мм, плечо момента от силы газовой каморы
    n_dx: 50, // на сколько точек по координате разделять длину ствола
  };

  @observable varInput = {
    n_dx_г: 50,
  };

  convertToSI = () => {
    const { input } = this;
    return {
      ...input,

      e: input.e * 10.0 ** 6,
      d1: input.d1 * 10.0 ** -3,
      gp: input.gp * 10.0 ** -3,
      h_г: input.h_г * 10.0 ** -3,
    };
  };

  @action calculation = async () => {
    this.isLoading = true;
    try {
      const res = await axios.get(
        '/cal_vibration_with_gas_engine_api/',
        { params: { ...this.convertToSI(), ...gasEngineStore.convertToSI() } },
      );
      console.log(res.data.y_res_arr);
      this.charts = res.data;
    } catch (e) {
      alert(`Ошибка: ${e.response.data}`);
    } finally {
      this.isLoading = false;
    }
  };

  subscribeReadPercent = () => {
    this.timerId = setInterval(() => {
      fs.readFile('.percent', 'utf8', (err, percent) => {
        if (err) return;
        this.percent = Number(percent);
      });
    }, 500);
  };

  unsubscribeReadPercent = () => {
    clearInterval(this.timerId);
    fs.unlink('.percent');
  };

  @action calculationVar = async () => {
    this.percent = 0;
    this.isLoadingVar = true;
    this.subscribeReadPercent();
    try {
      const res = await axios.get(
        '/cal_var_vibration_api/',
        { params: { ...this.convertToSI(), ...gasEngineStore.convertToSI(), ...this.varInput } },
      );
      this.varCharts = res.data;
    } finally {
      this.unsubscribeReadPercent();
      this.isLoadingVar = false;
    }
  }
}

const vibrationStore = new VibrationStore();

export default vibrationStore;
export { VibrationStore };
