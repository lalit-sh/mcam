import React, { Component } from 'react';
import { Header, Left, Button, Icon, Body, Right, Title, View } from "native-base";
import { DrawerActions } from 'react-navigation-drawer';
import {style} from './style';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleMenuAction = () => {
    let { navigation, isBack } = this.props;
    if(isBack){
      return this.props.navigation.goBack();
    }
    return navigation.dispatch(DrawerActions.toggleDrawer());
  }

  handleEllipseMenu = (value) => {
    let { onEllipseItemClick } = this.props;
    if(onEllipseItemClick) return onEllipseItemClick(value);
    return true;
  }

  render() {
    let { title, children, isBack, isEllipseMenu, ellipseMenu } = this.props;
    return (
        <Header style = {style.header}>
            <Left>
                <Button
                    transparent
                    onPress={this.handleMenuAction}>
                    <Icon type="FontAwesome" name={isBack ? "chevron-left" : "bars"} style = {style.text}/>
                </Button>
            </Left>
            <Body>
                <Title style = {style.text}>{title}</Title>
            </Body>
            <Right>
                {children}
                {isEllipseMenu &&
                  <Menu onSelect={this.handleEllipseMenu}>
                    <MenuTrigger style={style.ellipseMenuTrigger}>
                          <Icon type="FontAwesome" name="ellipsis-v" style={style.ellipseIcon}/>
                    </MenuTrigger>
                    <MenuOptions style={style.ellipseMenuOptions}>
                        {ellipseMenu && 
                          ellipseMenu.map((el, i) => <MenuOption key={el.title + i} value={el.value || el.title || el} text={el.title || el}/>)
                        }
                    </MenuOptions>
                  </Menu>
                }
            </Right>
        </Header>
    );
  }
}

export default HeaderComponent;