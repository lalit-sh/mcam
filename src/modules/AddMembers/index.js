import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { updateTrip } from "../../redux/actions/trips.action";
import { getUserContacts, clearError } from "../../redux/actions/users.action";
import Toast from 'react-native-easy-toast'
import { Container, Button, Icon, List, ListItem, Thumbnail, Text, Item, Body, Right, Content, Input, Left, View } from "native-base";
import Loading from "../../shared/Loading";
import Header from "../../shared/Header";

class AddMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tripName: props.navigation.state.params.tripName
    };
    this._toast = createRef();
    this.initialized = false;
  }

  componentDidMount = () => {
    this.props.getUserContacts();
    this.initialized = true;
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.users.error && this.initialized && this._toast.current){
        this._toast.current.show(this.props.trips.error, 100);
        this.props.clearError();
    }

    if(this.props.navigation.state.params.tripName != this.state.tripName){
      this.setState({tripName: this.props.navigation.state.params.tripName})
    }

  };

  isAlreayAMember = (obj) => {
    let tripName = this.state.tripName;
    let trip = this.getTrip(tripName);
    if(!trip){
      this._toast.current.show("Invalid trip selected", 100);
      this.props.navigation.navigate("Trips");
    }

    if(trip.members && trip.members.includes(obj.username)){
      return true;
    }
    
    return false;
  }

  getTrip(tripName){
    let trips = this.props.trips.trips;
    for(let trip of trips){
      if(trip.name != tripName){
        continue;
      }
      return trip;
    }

    return null;
  }

  handleAddMember = (username) => {
    if(username && username.trim()){
      let trip = this.getTrip(this.state.tripName);
      let m = trip.members
      if(!m || !Array.isArray(m)){
        m = [];
      }
      m.push(username);
      this.props.updateTrip(this.state.tripName,  {members: m})
    }
  }
  

  render() {
    let { loading, contacts } = this.props;
    if(loading || !this.initialized)
        return <Loading />
    
    if(!contacts)
      contacts = [];
    return (
        <Container>
            <Header {...this.props} title="Add Members" isBack={true}/>
            {(contacts && contacts.length > 0) &&
              <List>
                {contacts.map((el, i) => 
                  <ListItem thumbnail key={el.username + i} button={true} onPress={this.handleAddMember.bind(this, el.username)} >
                    <Left>
                        <Thumbnail square source={{ uri: 'https://img.icons8.com/bubbles/100/000000/user.png' }} />
                    </Left>
                    <Body>
                        <Text>{el.username}</Text>
                    </Body>
                    <Right>
                        {this.isAlreayAMember(el) &&
                          <View>
                            <Icon type='FontAwesome' name="check" style={{color: "green"}} />
                          </View>
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
            <Toast ref={this._toast}/>
        </Container>
    );
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators({ updateTrip, getUserContacts, clearError }, dispatch);
}
  
  //mapping reducer states to component
  const mapStateToProps = (state) => ({
    trips: state.trips,
    contacts: state.users ? state.users.contacts ? state.users.contacts : [] : [],
    users: state.users,
    loading: state.trips.loading || state.users.loading
  });
  

export default connect(mapStateToProps, mapDispathToProps)(AddMember);