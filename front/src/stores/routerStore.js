import {action, observable} from 'mobx';

class RouterStore {
    routes = {
        ballistics: 'ballistics',
        gasEngine: 'gasEngine',
        vibration: 'vibration',
    };

    @observable route = this.routes.gasEngine;

    @action changeRoute = (route) => {
        this.route = route;
    }
}

const routerStore = new RouterStore();

export default routerStore;
export {RouterStore};
