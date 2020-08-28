import { StyleSheet } from "react-native";

export const cameraStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footer:{
    flex: 0, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: "center", 
    padding: 20, 
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 0,
    // backgroundColor: 'rgba(52, 52, 52, 0.4)'
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
  }
});