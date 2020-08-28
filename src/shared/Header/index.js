import React, { Component } from 'react';
import { Header, Left, Button, Icon, Body, Right, Title } from "native-base";
import { DrawerActions } from 'react-navigation-drawer';


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
        <Header>
            <Left>
                <Button
                    transparent
                    onPress={this.handleMenuAction}>
                    <Icon type="FontAwesome" name={isBack ? "chevron-left" : "bars"} />
                </Button>
            </Left>
            <Body>
                <Title>{title}</Title>
            </Body>
            <Right>
                {children}
            </Right>
        </Header>
    );
  }
}

export default HeaderComponent;