import React, { Component, createRef } from 'react';
import { Container, Button, Icon, List, ListItem, Thumbnail, Text, Item, Body, Right, Content, Input, Left, View } from "native-base";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getTrips, createTrip, updateTrip, deleteTrip, clearError, markTripActive } from "../../redux/actions/trips.action";
import Loading from "../../shared/Loading";
import Header from "../../shared/Header";
import Toast from 'react-native-easy-toast'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';

class Trips extends Component {
  constructor(props) {
    super(props);
    this.state = {
        addingNew: false,
        tripName: "",
        isMenuOpen: false
    };
    this._toast = createRef();
    this.manageAddTrip = this.manageAddTrip.bind(this);
  }

  componentDidMount = () => {
    if((!this.props.trips || !this.props.trips.trips || this.props.trips.trips.length == 0) && !this.props.loading)
        this.props.getTrips();
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(this.props.trips.error && this._toast.current){
      this._toast.current.show(this.props.trips.error, 100);
      this.props.clearError();
    }
  };
  

  manageAddTrip = () => {
    if(this.state.addingNew){
        if(this.state.tripName && this.state.tripName.trim() !== "")
            this.props.createTrip(this.state.tripName);
        this.setState({
            addingNew: false
        });
    }else{
        this.setState({
            addingNew: true
        });
    }
  }

  handleTripName = tripName => {
      this.setState({
          tripName
      });
  }

  handleMenuSelect = value => {
    value = value.split("::");
    if(value[0] !== "delete"){
        this.props.navigation.navigate(value[0], value[1] ? {tripName: value[1]} : "");
        return true;
    }
    return false;
  }

  markSelected(trip){
      this.props.markTripActive(trip);
  }

  render() {
    let { trips, loading } = this.props.trips;
    if(loading)
        return <Loading />
    
    let isTrips = trips.length > 0;
    let tripList = null;
    if(isTrips)
        trips = trips.sort((x, y) => x.isActive ? -1 : 0);
        tripList = trips.map((el, i) => {
            return <ListItem thumbnail key={el.name + i} button onPress={this.markSelected.bind(this, el)}>
                <Left>
                    <Thumbnail square source={{ uri: 'https://picsum.photos/id/237/200/200' }} />
                </Left>
                <Body>
                    <Text>{el.name}</Text>
                </Body>
                <Right>
                    <Menu onSelect={this.handleMenuSelect}>
                        <MenuTrigger style={{disabled: "flex", width: 20, height: 20, justifyContent: "center", alignItems: 'center',}}>
                            <View>
                                <Icon type="FontAwesome" name="ellipsis-v"/>
                            </View>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption value={`Gallery::${el.name}`} text='View Images' />
                            <MenuOption value={`AddMembers::${el.name}`} text='Members' />
                            <MenuOption value={"delete"} disabled text='Delete' />
                        </MenuOptions>
                    </Menu>
                </Right>
            </ListItem>
        })
    return (
        <Container>
            <Header {...this.props} title="Groups" isBack={true}>
                <Button
                    transparent
                    onPress={this.manageAddTrip}>
                        <Icon type="FontAwesome" name={this.state.addingNew ? "check" : "plus"} />
                </Button>
            </Header>
            <Content>
                {this.state.addingNew && 
                    <Item>
                        <Input placeholder="Group Name" onChangeText={this.handleTripName}/>
                    </Item>
                }
                {isTrips &&
                    <List>
                        {tripList}
                    </List>
                }
                {(!isTrips && !this.state.addingNew) &&
                    <Content>
                        <Text>
                            You dont have any Group. Add one now.
                        </Text>
                    </Content>
                }
            </Content>
            <Toast ref={this._toast}/>
        </Container>
    );
  }
}


function mapDispathToProps(dispatch) {
    return bindActionCreators({ getTrips, createTrip, updateTrip, deleteTrip, clearError, markTripActive }, dispatch);
  }
  
  //mapping reducer states to component
  const mapStateToProps = (state) => ({
    trips: state.trips,
    loading: state.trips.loading
  });
  
  
  export default connect(mapStateToProps, mapDispathToProps)(Trips);
  
  