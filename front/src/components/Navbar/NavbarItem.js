import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Menu} from 'semantic-ui-react';

@inject('routerStore')
@observer
class NavbarItem extends Component {
    handleOnClick = (route) => {
        this.props.routerStore.changeRoute(route);
    };

    render() {
        const {route: activeRoute} = this.props.routerStore;
        const {route, children} = this.props;

        return (
            <Menu.Item
                as='a'
                active={route === activeRoute}
                onClick={() => this.handleOnClick(route)}
            >
                {children}
            </Menu.Item>
        );
    }
}

export default NavbarItem;
