import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Menu} from 'semantic-ui-react';
import NavbarItem from './NavbarItem';
import './style.css';

@inject('routerStore')
@observer
class Navbar extends Component {
    render() {
        const {routes} = this.props.routerStore;

        return (
            <Menu size='large' className='navbar'>
                <NavbarItem route={routes.ballistics}>Расчет баллистики</NavbarItem>
                <NavbarItem route={routes.gasEngine}>Расчет бокового газового двигателя</NavbarItem>
                <NavbarItem route={routes.vibration}>Расчет коллебаний</NavbarItem>
            </Menu>
        );
    }
}

export default Navbar;
