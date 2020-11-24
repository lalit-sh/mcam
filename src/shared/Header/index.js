import React, { Component } from 'react';
import { Header, Left, Button, Icon, Body, Right, Title } from "native-base";
import { DrawerActions } from 'react-navigation-drawer';
import {style} from './style';


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

  render() {
    let { title, children, isBack } = this.props;
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
            </Right>
        </Header>
    );
  }
}

export default HeaderComponent;