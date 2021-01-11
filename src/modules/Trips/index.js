import React, { Component, createRef } from 'react';
import { Container, Button, Icon, List, ListItem, Thumbnail, Text, Item, Body, Right, Content, Input, Left, View } from "native-base";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getTrips, createTrip, updateTrip, deleteTrip, clearError, markTripActive } from "../../redux/actions/trips.action";
import Loading from "../../shared/Loading";
import Header from "../../shared/Header";
import {Modal} from "react-native"
import Toast from 'react-native-easy-toast';
import { style } from './style';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import { color } from 'react-native-reanimated';
import AsyncStorage from '@react-native-community/async-storage';
import SwitchWithIcons from "react-native-switch-with-icons";
 

class Trips extends Component {
  constructor(props) {
    super(props);
    this.state = {
        tripName: "",
        isMenuOpen: false,
        show: false
    };
    this._toast = createRef();
  }

  componentDidMount = () => {
    if((!this.props.trips || !this.props.trips.trips || this.props.trips.trips.length == 0) && !this.props.loading)
        this.props.getTrips();
    this.setActiveTripFromStorage();
  }

  setActiveTripFromStorage = async () => {
    try{
        let activetrip = await AsyncStorage.getItem('ACTIVE_TRIP');
        if(activetrip){
            activetrip = JSON.parse(activetrip);

            if(activetrip && activetrip._id && (!this.props.trips.activeTrip || (activetrip._id !== this.props.activeTrip._id))){
                this.markSelected(activetrip)
            }
        }
    }catch(err){
        console.log(err);
    }
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(this.props.trips.error && this._toast.current){
      this._toast.current.show(this.props.trips.error, 100);
      this.props.clearError();
    }
  };

  manageAddTrip = () => {
        if(this.state.tripName && this.state.tripName.trim() !== "")
            this.props.createTrip(this.state.tripName);
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

  handleTrip = trip => {
      if(trip)
        this.props.navigation.navigate("ManageTrip", trip._id);
  }

  markSelected(trip, event){
      this.props.markTripActive(trip);
  }

  isTripActive(trip){
      console.log("trips")
      console.log(trip)
      console.log(this.props)
      if(trip && this.props.trips && this.props.trips.activeTrip && this.props.trips.activeTrip._id == trip._id) return true;
      return false;
  }

  render() {
    let { trips, loading } = this.props.trips;
    if(loading)
        return <Loading />
    
    let isTrips = trips.length > 0;
    let tripList = null;
    if(isTrips)
        // trips = trips.sort((x, y) => x.isActive ? -1 : 0);
        tripList = trips.map((el, i) => {
            return <ListItem thumbnail key={el.name + i} button onPress={() => this.handleTrip(el)}>
                <Left>
                    <Thumbnail square source={{ uri: 'https://img.icons8.com/color/72/gallery.png' }} />
                </Left>
                <Body>
                    <Text style = {{fontSize: 20}}>{el.name}</Text>
                </Body>
                <Right>
                    <SwitchWithIcons 
                        onValueChange={this.markSelected.bind(this, el)}
                        value={this.isTripActive(el)}
                    />
                    {/* <Menu onSelect={this.handleMenuSelect}>
                        <MenuTrigger style={{disabled: "flex", width: 20, height: 20, justifyContent: "center", alignItems: 'center'}}>
                            <View>
                                <Icon type="FontAwesome" name="ellipsis-v" style = {{fontSize: 20}}/>
                            </View>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption value={`Gallery::${el.name}`} text='View Images' />
                            <MenuOption value={`AddMembers::${el.name}`} text='Members' />
                            <MenuOption value={"delete"} disabled text='Delete' />
                        </MenuOptions>
                    </Menu> */}
                </Right>
               
            </ListItem>
        })
    return (
        <Container >
            <Header {...this.props} title="Groups" isBack={true}>
                <Button transparent>
                        <Icon type="FontAwesome" name="ellipsis-v" style = {{color: "#000"}}/>
                </Button>
            </Header>
            <Content style = {{top:20}} >
                {isTrips &&
                    <List style = {{ border: 5}}>
                        {tripList}
                    </List>
                }
                {(!isTrips) &&
                    <Content>
                        <Text style={style.noContentText}>
                            You don't have any group yet.
                        </Text>
                        <Text style={style.noContentText}>
                            Create one by clicking
                        </Text>
                        <Text style={style.noContentText}>
                            <Icon type="AntDesign" name= "pluscircle" onPress={()=>{this.setState({show:true})}} style={{...style.plusButton, fontSize: 24}}/>
                        </Text>
                    </Content>
                }
               </Content>
            <Toast ref={this._toast}/>   
            <Modal style = {{marginTop:50}}
                    transparent={true}
                    visible={this.state.show}>

                <View style= {style.modelViewOne}>
                <View style = {style.modelViewTwo}>
                    <Input placeholder = "Please enter group name" onChangeText={this.handleTripName} style = {style.popupInut}/>
                        <View style = {style.popupView}>
                            <Button onPress= {()=>{this.setState({show:false})}} style = {style.cancelButton}>
                                <Text>
                                    Cancel
                                </Text>
                            </Button>
                            <Button onPress= {this.manageAddTrip} style = {style.okButton}>
                                <Text>
                                     OK
                                </Text>
                            </Button>
                        </View>
                    </View>
                    </View>
                </Modal>
                <Icon type="AntDesign" name= "pluscircle" onPress={()=>{this.setState({show:true})}} style={style.plusButton}/>
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
  
  