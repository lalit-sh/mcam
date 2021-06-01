import React, { Component, createRef } from 'react';
import { Container, Button, Icon, List, ListItem, Thumbnail, Text, Item, Body, Right, Content, Input, Left, View } from "native-base";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getTrips, createTrip, updateTrip, deleteTrip, clearError, markTripActive } from "../../redux/actions/trips.action";
import Loading from "../../shared/Loading";
import Header from "../../shared/Header";
import { Modal, StatusBar } from "react-native"
import Toast from 'react-native-easy-toast';
import { style } from './style';
import AsyncStorage from '@react-native-community/async-storage';
import SwitchWithIcons from "react-native-switch-with-icons";
import { AppStyle } from "../../App.style";


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
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(this.props.trips.error && this._toast.current){
            this._toast.current.show(this.props.trips.error, 100);
            this.props.clearError();
        }
        if(this.state.show && prevProps.loading && !this.props.loading && !this.props.trips.error){
            this.setState({
                show: false
            })
        }
    }

    manageAddTrip = () => {
        if(!this.props.loading && this.state.tripName && this.state.tripName.trim() !== "")
            this.props.createTrip(this.state.tripName);
    }

    handleTripName = tripName => {
        this.setState({
            tripName
        });
    }

    handleEllipseMenu = value => {
        let tasks = {
            "Refresh": this.props.getTrips
        }
        tasks[value] && tasks[value](); 
        return true;
    }

    handleTrip = trip => {
        if(trip)
            this.props.navigation.navigate("ManageTrip", {tripId: trip._id});
    }

    markSelected(trip, event){
        this.props.markTripActive(trip);
    }

    isTripActive(trip){
        if(trip && this.props.trips && this.props.trips.activeTrip && this.props.trips.activeTrip._id == trip._id) return true;
        return false;
    }

    render() {
        let { trips, loading } = this.props.trips;
        // if(loading)
            // return <Loading />
        
        let isTrips = trips.length > 0;
        let tripList = null;
        if(isTrips){
            // trips = trips.sort((x, y) => x.isActive ? -1 : 0);
            tripList = trips.map((el, i) => {
                return <ListItem thumbnail key={el.name + i} button onPress={() => this.handleTrip(el)}>
                    <Left>
                        <Thumbnail square source={{ uri: 'https://img.icons8.com/color/72/gallery.png' }} />
                    </Left>
                    <Body>
                        <Text style = {{fontSize: 20, ...AppStyle.text}}>{el.name}</Text>
                    </Body>
                    <Right>
                        <SwitchWithIcons 
                            onValueChange={this.markSelected.bind(this, el)}
                            value={this.isTripActive(el)}
                        />
                    </Right>
                </ListItem>
            })
        }
        return (
            <Container style={AppStyle.container}>
                <Header {...this.props} title="Groups" isBack={true} isEllipseMenu={true} ellipseMenu={["Refresh"]} onEllipseItemClick={this.handleEllipseMenu}/>
                <Content style = {{top:20}} >
                    {isTrips &&
                        <List>
                            {tripList}
                        </List>
                    }
                    {(!isTrips) &&
                        <Content>
                            <Text style={[style.noContentText, AppStyle.text]}>
                                You don't have any group yet.
                            </Text>
                            <Text style={[style.noContentText, AppStyle.text]}>
                                Create one by clicking
                            </Text>
                            <Text style={[style.noContentText, AppStyle.text]}>
                                <Icon type="AntDesign" name= "pluscircle" onPress={()=>{this.setState({show:true})}} style={{...style.plusButton, fontSize: 24, ...AppStyle.text}}/>
                            </Text>
                        </Content>
                    }
                </Content>
                <Toast ref={this._toast}/>   
                <Modal style = {{marginTop:50}}
                    transparent={true}
                    visible={this.state.show}>
                    <View style= {style.modelViewOne}>
                        <View style = {[style.modelViewTwo,AppStyle.container]}>
                            <Input placeholder = "Please enter group name" onChangeText={this.handleTripName} style = {style.popupInut}/>
                            <View style = {style.popupView}>
                                <Button onPress= {()=>{this.setState({show:false})}} style = {style.cancelButton}>
                                    <Text>
                                        Cancel
                                    </Text>
                                </Button>
                                <Button onPress= {this.manageAddTrip} style = {style.okButton}>
                                    {loading ?
                                        <Loading /> :
                                        <Text>
                                            OK
                                        </Text>
                                    }
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