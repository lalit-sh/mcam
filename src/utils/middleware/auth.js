import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from "../../redux/actions/identity.action";
import { bindActionCreators } from "redux";
class AuthMiddleWare extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.checkAuthentication();
  }

  isSessionExpired(){
    if(!this.props.identity || !this.props.identity.isLoggedIn){
      return true;
    }

    let d1 = new Date(this.props.identity.expires);
    let d2 = new Date();
    let diff = d2 - d1;
    if(Math.sign(diff) == 1){
      return true;
    }

    return false;

  }

  checkAuthentication = async () => {
        if(this.props.identity.isLoggedIn){
          if(this.isSessionExpired()){
            return this.props.logout();
          }
          this.props.navigation.navigate("App");
        }
        else
            this.props.navigation.navigate("Auth");
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ logout }, dispatch);
}

const mapStateToProps = (state) => ({
    identity: state.identity
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthMiddleWare)




