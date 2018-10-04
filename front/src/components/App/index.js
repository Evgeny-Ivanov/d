import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import GasEngine from '../GasEngine';
import Navbar from '../Navbar';
import Vibration from '../Vibration';
import Ballistics from '../Ballistics';
import ErrorModal from './ErrorModal';
import './style.css';

@inject('routerStore')
@observer
class App extends Component {
  getComponent = () => {
    const { routes, route } = this.props.routerStore;

    switch (route) {
    case routes.ballistics:
      return <Ballistics />;
    case routes.gasEngine:
      return <GasEngine />;
    case routes.vibration:
      return <Vibration />;
    default:
      return <div>404</div>;
    }
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className='app-content'>
          {this.getComponent()}
          <ErrorModal />
        </div>
      </div>
    );
  }
}

export default App;
