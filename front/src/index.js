import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Provider } from 'mobx-react';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import gasEngineStore from './stores/gasEngineStore';
import routerStore from './stores/routerStore';
import vibrationStore from './stores/vibrationStore';

const stores = {
  gasEngineStore,
  routerStore,
  vibrationStore,
};

axios.defaults.timeout = 100000000000000000000000000000000000000000000;

ReactDOM.hydrate(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
