import {
  Body,
  Container,
  Content,
  Icon,
  Left,
  ListItem,
  Right,
  Switch,
  Text,
} from 'native-base';
import React, {Component} from 'react';
import Header from '../../../shared/Header';

class CameraSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'key1',
    };
  }
  onValueChange(value) {
    this.setState({
      selected: value,
    });
  }

  render() {
    return (
      <Container>
        <Header {...this.props} title="CameraSetting" isBack={true} />
        <Content style={{top: 30}}>
          <ListItem style={{borderBottomWidth: 0}}>
            <Left>
              <Text>Grid</Text>
            </Left>
            <Body />
            <Right>
              <Switch value={true} />
            </Right>
          </ListItem>
          <ListItem style={{borderBottomWidth: 0}}>
            <Left>
              <Text>Image Resolution</Text>
            </Left>
            <Body />
            <Right>
              <Icon type="FontAwesome" name="chevron-down" />
            </Right>
          </ListItem>
        </Content>
      </Container>
    );
  }
}

export default CameraSetting;
