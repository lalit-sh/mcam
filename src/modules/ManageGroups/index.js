import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { updateTrip } from "../../redux/actions/trips.action";
import { getUserContacts, clearError, syncUserContacts } from "../../redux/actions/users.action";
import Toast from 'react-native-easy-toast'
import { PermissionsAndroid, Platform, Alert, Linking, AppState } from 'react-native';
import Contacts from 'react-native-contacts';
import { Container, Button, Icon, List, ListItem, Thumbnail, Text, Item, Body, Right, Content, Input, Left, View } from "native-base";
import Loading from "../../shared/Loading";
import Header from "../../shared/Header";
import RNExitApp from 'react-native-exit-app';

class ManageGroups extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      tripName: props.navigation.state.params.tripId,
      appState: AppState.currentState,
      initialized: false
    };
    this._toast = createRef();
    this.initialized = false;
  }

  componentDidMount = () => {
    // this.props.getUserContacts();
    if(!this.props.contacts)
      this.syncUserContacts();
    else
      this.setState({
        initialized : true
      })
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.requestingPermission && this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.syncUserContacts();
    }
  }

  syncUserContacts = async () => {
    try{
      if(Platform.OS === 'ios'){
        Contacts.getAll((err, contacts) => {
          if (err) {
            throw err;
          }
          // contacts returned
          this.setState({contacts})
        })
      }else if(Platform.OS === 'android'){

        let checkPermission = await Contacts.checkPermission();
        if(checkPermission == 'denied'){
          let rp = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Contacts',
              message: 'This app would like to view your contacts.'
            }
          );
          if(rp == 'never_ask_again'){
            return Alert.alert("Allow Permission", "Contacts Read Permission is required. Goto: Settings->Apps->mcam->Permissions and allow contacts permission.",  [
              {
                text: "Cancel",
                onPress: () => RNExitApp.exitApp(),
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                this.setState({
                  requestingPermission: true
                })
                if(!this.appStateEvent){
                  AppState.addEventListener('change', this._handleAppStateChange);
                  this.appStateEvent = true;
                }
                Linking.openSettings()
              }}
            ])
          }
        }

        let contacts = await Contacts.getAllWithoutPhotos();
        let c=[];
        contacts.map(el => {
          let  o = {
            name: el.displayName
          }
          if(Array.isArray(el.phoneNumbers)){
            el.phoneNumbers.map(l => {
              o["number"] = l.number.replace(/[^0-9]/g, "")
              console.log("o.number", o.number, this.props.username)
              if(o.number !== this.props.username)
                c.push(o);
            })
          }

          if(typeof el.phoneNumbers == 'string'){
            o["number"] = el.phoneNumbers.replace(/[^0-9]/g, "");
            console.log("o.number", o.number, this.props.username)
            if(o.number !== this.props.username)
              c.push(o);
          }
        })
        this.props.syncUserContacts(c);
        this.setState({
          initialized: true
        })
      }
    }catch(err){
      console.log(err);
    }
  }

  componentWillUnmount() {
    if(this.appStateEvent)
      AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.users.error && this.initialized && this._toast.current){
        this._toast.current.show(this.props.trips.error, 100);
        this.props.clearError();
    }

    if(this.props.navigation.state.params.tripId != this.state.tripName){
      this.setState({tripName: this.props.navigation.state.params.tripId})
    }

  };

  isAlreayAMember = (obj) => {
    let tripName = this.state.tripName;
    let trip = this.getTrip(tripName);
    if(!trip){
      // this._toast && this._toast.current && this._toast.current.show("Invalid trip selected", 100);
      // this.props.navigation.navigate("Trips");
      return false;
    }

    if(trip && trip.members && trip.members.includes(obj.number)){
      return true;
    }
    
    return false;
  }

  getTrip(tripName){
    let trips = this.props.trips.trips;
    for(let trip of trips){
      if(trip._id != tripName){
        continue;
      }
      return trip;
    }

    return null;
  }

  handleAddMember = (username) => {
    if(username && username.trim()){
      let trip = this.getTrip(this.state.tripName);
      let m = trip && trip.members
      if(!m || !Array.isArray(m)){
        m = [];
      }
      let i = m.indexOf(username);
      if(i > -1){
        m.splice(i, 1);
      }else{
        m.push(username);
      }
      this.props.updateTrip(trip.name,  {members: m})
    }
  }

  handleInviteUser = (number) => {
    console.log("InviteUser", number);
  }
  
  handleEllipseMenu = () => {
    this.syncUserContacts();
  }

  render() {
    let { loading, contacts } = this.props;
    if(!this.state.initialized)
        return <Loading />
    
    if(!contacts)
      contacts = [];
    return (
        <Container>
            <Toast ref={this._toast}/>
            <Header {...this.props} title="Add Members" isBack={true} isBack={true} isEllipseMenu={true} ellipseMenu={["Refresh"]} onEllipseItemClick={this.handleEllipseMenu}/>
            {(contacts && contacts.length > 0) &&
              <List>
                {contacts.map((el, i) => 
                  <ListItem thumbnail key={el.number + i} button={true} onPress={() => this.handleAddMember(el.number)} >
                    <Left>
                        <Thumbnail square source={{ uri: 'https://img.icons8.com/bubbles/100/000000/user.png' }} />
                    </Left>
                    <Body>
                        <Text>{el.name}</Text>
                    </Body>
                    <Right>
                        {this.isAlreayAMember(el) &&
                          <View>
                            <Icon type='FontAwesome' name="check" style={{color: "green"}} />
                          </View>
                        }
                        {!el.isActive &&
                          <Button transparent onPress={() => this.handleInviteUser(el.number)}>
                            <Text> Invite </Text>
                          </Button>
                        }
                    </Right>
                </ListItem>)}
              </List>
            }
            {(!contacts || contacts.length < 0) &&
                <Content>
                    <Text>
                      It seems like you have not synced your contact yet. Sync Now
                    </Text>
                </Content>
            }
        </Container>
    );
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators({ updateTrip, getUserContacts, clearError, syncUserContacts }, dispatch);
}
  
  //mapping reducer states to component
  const mapStateToProps = (state) => ({
    trips: state.trips,
    contacts: state.users ? state.users.contacts ? state.users.contacts : null : null,
    users: state.users,
    loading: state.trips.loading || state.users.loading,
    username: state.identity ? state.identity.username : false
  });
  

export default connect(mapStateToProps, mapDispathToProps)(ManageGroups);