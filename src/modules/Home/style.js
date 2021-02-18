import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native'

let {width, height} = Dimensions.get('window');
const bgColor = "rgba(0,0,0,1)";
const hfcolor = "rgba(0,0,0, 0.4)";

export const cameraStyle = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: bgColor,
    height: height,
    justifyContent: 'center',
  },
  footer:{
    // flex: 0, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: "center", 
    padding: 20,
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: hfcolor,
    zIndex: 9
  },
  header:{
    backgroundColor: hfcolor,
    // opacity: 0.1,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    position: 'absolute',
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1
  },
  headerIconStyle: {
    color: "#fff",
    fontSize: 28
  },
  addTripIconStyle: {
    // position: "absolute",
    textAlign: "center",
    // right:0,
    // alignSelf: 'flex-end',
    flex: 1, flexDirection: 'row'
  },
  capture: {
    flex: 0,
    borderColor: "#686868",
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 50,
    padding: 5
  },
  captureInnerCircle: {
    flex: 0,
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 3,
    borderStyle: "solid",
    borderRadius: 50,
    padding: 25
  },
  gallery: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 50
  },
  preview: {
    // bottom: '-5%',
    transform: [{rotate: '350deg'}]
  },
  previewContainer: {
    position: 'absolute',
    zIndex: 8,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgba(0,0,0,0.4)"
  }
});

export const ratioIconStyle = {
  container: {
    textAlign: "center", 
    justifyContent: "center", 
    width:28,
  },
  body: {
    width:18, 
    height: 26, 
    borderRadius:5,
    textAlign: 'center', 
    borderColor:"#fff", 
    borderWidth: 1,
    position: "absolute",
    left: "20%"
  },
  text: {
    backgroundColor: "#000", 
    textAlign: "center",
    color: "#fff",
    borderRadius: 5
  }
}