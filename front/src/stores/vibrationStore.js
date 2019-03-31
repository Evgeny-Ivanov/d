import {action, observable} from 'mobx';
import axios from 'axios';
import gasEngineStore from './gasEngineStore';

// const electron = window.require('electron');
// const fs = electron.remote.require('fs');

class VibrationStore {
    @observable isLoading;

    @observable isLoadingVar;

    @observable isLoadingVarL;

    @observable isLoadingVarD;

    @observable percent;

    @observable charts = {};

    @observable varCharts = {};

    @observable varChartsL = {};

    @observable varChartsD = {};

    @observable input = {
        e: 200000, // модуль Юнга, МПа
        ro: 7800, // плотность,кг/м³
        d1: 20, // наружный диаметр ствола, мм
        d2: 10, // наружный диаметр ствола, мм
        q1: 0.1, // кг, масса газовой каморы
        q2: 0.2, // кг, масса надульного устройства
        gp: 9, // г, масса пули
        cit: 1, //0.3, // соотношение между шагом по времени и координате
        h_г: 20, // мм, плечо момента от силы газовой каморы
        n_dx: 30, //50, // на сколько точек по координате разделять длину ствола
        with_gas_engine: 1,
    };

    convertToSI = () => {
        const {input} = this;
        return {
            ...input,

            e: input.e * 10.0 ** 6,
            d1: input.d1 * 10.0 ** -3,
            d2: input.d2 * 10.0 ** -3,
            gp: input.gp * 10.0 ** -3,
            h_г: input.h_г * 10.0 ** -3,
        };
    };

    @action calculation = async () => {
        this.isLoading = true;
        try {
            const res = await axios.get(
                '/cal_vibration_with_gas_engine_api/',
                {params: {...this.convertToSI(), ...gasEngineStore.convertToSI()}},
            );
            this.charts = res.data;
        } catch (e) {
            alert(`Ошибка: ${e.response.data}`);
        } finally {
            this.isLoading = false;
        }
    };

    // subscribeReadPercent = () => {
    //     this.timerId = setInterval(() => {
    //         fs.readFile('../back/.percent', 'utf8', (err, percent) => {
    //             if (err) return;
    //             this.percent = Number(percent);
    //         });
    //     }, 500);
    // };
    //
    // unsubscribeReadPercent = () => {
    //     clearInterval(this.timerId);
    //     fs.unlink('../back/.percent');
    // };

    @action calculationVar = async () => {
        this.percent = 0;
        this.isLoadingVar = true;
        // this.subscribeReadPercent();
        try {
            const res = await axios.get(
                '/cal_var_vibration_api/',
                {params: {...this.convertToSI(), ...gasEngineStore.convertToSI(), n_dx_г: this.input.n_dx}},
            );
            this.percent = 100;
            this.varCharts = res.data;
        } finally {
            // this.unsubscribeReadPercent();
            this.isLoadingVar = false;
        }
    };

    @action calculationVarL = async () => {
        this.isLoadingVarL = true;
        try {
            const res = await axios.get(
                '/cal_var_vibration_l_api/',
                {params: {...this.convertToSI(), ...gasEngineStore.convertToSI()}},
            );
            this.varChartsL = res.data;
        } finally {
            this.isLoadingVarL = false;
        }
    };

    @action calculationVarD = async () => {
        this.isLoadingVarD = true;
        try {
            const res = await axios.get(
                '/cal_var_vibration_d_api/',
                {params: {...this.convertToSI(), ...gasEngineStore.convertToSI(), n_dx_d: 10}},
            );
            this.varChartsD = res.data;
        } finally {
            this.isLoadingVarD = false;
        }
    };
}

const vibrationStore = new VibrationStore();

export default vibrationStore;
export {VibrationStore};
