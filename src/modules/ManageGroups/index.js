import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { updateTrip, manageMembersToGroup, deleteGroup } from "../../redux/actions/trips.action";
import { getUserContacts, clearError, syncUserContacts } from "../../redux/actions/users.action";
import Toast from 'react-native-easy-toast'
import { PermissionsAndroid, Platform, Alert, Linking, AppState, Share, TouchableOpacity } from 'react-native';
import Contacts from 'react-native-contacts';
import { Container, Icon, List, ListItem, Thumbnail, Text, Item, Body, Right, Content, Input, Left, View } from "native-base";
import Loading from "../../shared/Loading";
import Header from "../../shared/Header";
import RNExitApp from 'react-native-exit-app';
import { style } from "./style";
import { AppStyle } from "../../App.style";
class ManageGroups extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tripId: props.navigation.state.params.tripId,
			tripName: props.navigation.state.params.tripName,
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
						PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
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
							{ 
								text: "OK", 
								onPress: () => {
									this.setState({
										requestingPermission: true
									})
									if(!this.appStateEvent){
										AppState.addEventListener('change', this._handleAppStateChange);
										this.appStateEvent = true;
									}
									Linking.openSettings()
								}}
							]
						)
					}
				}
				
				let contacts = await Contacts.getAllWithoutPhotos();
				let c={};
				contacts.map(el => {
					if(Array.isArray(el.phoneNumbers)){
						el.phoneNumbers.map(l => {
							l = l.number.replace(/\D/g, '').slice(-10); 
							if(!c[l]) c[l] = el.displayName
						})
					}
					if(typeof el.phoneNumbers == 'string'){
						let l = el.phoneNumbers.replace(/\D/g, '').slice(-10); 
						if(!c[l]) c[l] = el.displayName;
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

		if(this.props.navigation.state.params.tripId != this.state.tripId){
			this.setState({tripId: this.props.navigation.state.params.tripId, tripName: this.props.navigation.state.params.tripName})
		}
	};

	isAlreayAMember = (number) => {
		let tripId = this.state.tripId;
		let trip = this.getTrip(tripId);
		if(!trip){
			return false;
		}
    
		return trip && trip.members && trip.members.find(el => el.username == number)    
	}

	getTrip(tripId){
		let trips = this.props.trips.trips;
		for(let trip of trips){
			if(trip._id != tripId){
				continue;
			}
			return trip;
		}
		return null;
	}

	handleAddMember = (username) => {
		if(username && username.trim()){
			let trip = this.getTrip(this.state.tripId);
			let m = trip && trip.members
			let addMember = true;
			if(!m || !Array.isArray(m)){
				m = [];
			}
			let i = m.findIndex(el => username == el.username);
			if(i > -1){
				addMember = false;
			}
			this.props.manageMembersToGroup({groupName: trip.name, groupId: trip._id, member: username.trim(), addMember});
			// this.props.updateTrip(trip.name,  {members: m})
		}
	}

	handleInviteUser = async () => {
		try {
			const result = await Share.share({
				message: 'Hey checkout MCaM a wonderfull app where images are shared on the go to whole group.'
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	handleEllipseMenu = () => {
		this.syncUserContacts();
	}

	handleDeleteGroup = (isAdmin) => {
		let trip = this.getTrip(this.state.tripId);
		if(isAdmin){
			this.state.isDeletingGroup = true;
			return this.props.deleteGroup(trip._id);
		}
		this.state.isLeavingGroup = true;
		this.props.manageMembersToGroup({groupName: trip.name, groupId: trip._id, member: this.props.username.trim(), addMember: false})
	}

	goBack = () => {
		this.props.navigation.goBack()
	}

	render() {
		let { username, contacts } = this.props;
		if(!this.state.initialized)
		return <Loading />
		if(!contacts)
			contacts = {};
			
		let trip = this.getTrip(this.state.tripId)

		if(!trip){
			let message = 'The group you are looking for does not exists anymore.';
			if(this.state.tripId){
				if(this.state.isDeletingGroup){
					message = `You have deleted this group.`;
				}else if(this.state.isLeavingGroup){
					message = "You left this group."
				}
			}
			return 	<Container style={AppStyle.container}>
						<Header {...this.props} isBack={true} title={this.state.tripName}/>
						<View style={[AppStyle.flexCenter]}>
							<Text style={[AppStyle.text, AppStyle.textCenter, AppStyle.marginBtm10]}>
								{message}
							</Text>
							<TouchableOpacity onPress={this.goBack} style={[AppStyle.dangerBtn, AppStyle.marginBtm20]}>
								<Text style={[AppStyle.text, AppStyle.textCenter]}>
									Go to Manage Groups
								</Text>
							</TouchableOpacity>
						</View>
					</Container> 
		}


		let admin = trip.members.find(el => el.isAdmin);
		const isAdmin = admin.username == username;
		return (
			<Container style={AppStyle.container}>
				<Toast ref={this._toast}/>
				<Header {...this.props} title={trip.name} isBack={true} isEllipseMenu={true} ellipseMenu={["Refresh"]} onEllipseItemClick={this.handleEllipseMenu}/>
				{(trip.members && trip.members.length) > 0 &&
					<View style={[style.sectionStyle, AppStyle.container]}>
						<View style={style.listHeader}>
							<Text style={[style.listHeaderText, AppStyle.text]}>
								Participants
							</Text>
						</View>
						<List>
							{trip.members.map((el, i) => 
								<ListItem 
									thumbnail 
									key={el + i}
									button={true} 
									onPress={() => el.username !== username && this.handleAddMember(el.username)} 
								>
									<Left>
										<Thumbnail square source={{ uri: 'https://img.icons8.com/bubbles/100/000000/user.png' }} />
									</Left>
									<Body style={{borderBottomWidth: 0}}>
										<Text style={AppStyle.text}>											
											{el.username == username ? "You" : (contacts[el.username] || el.username)}
										</Text>
									</Body>
									<Right style={{borderBottomWidth: 0}}>
										{el.isAdmin &&
											<Text style={[AppStyle.highlightOnText]}>admin</Text>
										}
									</Right>
								</ListItem>
							)}
						</List>
					</View>
				}
				<View style={[style.sectionStyle, AppStyle.container]}>
					{(isAdmin && contacts && Object.keys(contacts).length > 0) &&
						<>
							<View style={style.listHeader}>
								<Text style={[style.listHeaderText, AppStyle.text]}>
									Add members
								</Text>
							</View>
							<List>
								{Object.keys(contacts).map((el, i) => !this.isAlreayAMember(el) &&
									<ListItem 
										thumbnail 
										key={el + i}
										button={true} 
										onPress={() => this.handleAddMember(el)} 
									>
										<Left>
											<Thumbnail square source={{ uri: 'https://img.icons8.com/bubbles/100/000000/user.png' }} />
										</Left>
										<Body style={{borderBottomWidth: 0}}>
											<Text style={AppStyle.text}>{contacts[el]}</Text>
										</Body>
									</ListItem>
								)}
								<ListItem
									thumbnail 
									button={true} 
									onPress={() => this.handleInviteUser()} 
									style={style.inviteFriends}
								>
									<Left>
										<Icon type="FontAwesome" name="share-alt" style={style.inviteFriendsIcon} />
									</Left>
									<Body style={{borderBottomWidth: 0}}>
										<Text style={[style.inviteFriendsText, AppStyle.text]}>
											Invite friends
										</Text>
									</Body>
								</ListItem>
							</List>
						</>
					}
				</View>
				<TouchableOpacity style={[AppStyle.dangerBtn, AppStyle.btnBig, style.btnBottom]} onPress={() => this.handleDeleteGroup(isAdmin)}>
					<Text style={[AppStyle.text, AppStyle.textCenter]}>
						{isAdmin ? 
							"Delete Group" :
							"Leave Group"
						}
					</Text>
				</TouchableOpacity>
			</Container>
		);
	}
}

function mapDispathToProps(dispatch) {
	return bindActionCreators({ updateTrip, getUserContacts, clearError, syncUserContacts, manageMembersToGroup, deleteGroup }, dispatch);
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