import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container:{
        backgroundColor: "#000"
    },
    modelViewOne: {
        flex:1,flexDirection: 'column',
        backgroundColor: "rgba(189,189,189, 0.3)", 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    modelViewTwo: {
        backgroundColor:"#ffffff", 
        margin:0, 
        padding:25,
        paddingBottom:0,
        borderRadius:10, 
        flex:0,
        width: 300,
        height: 150,
        justifyContent: 'center', 
        alignItems: 'center', 
        overflow:"hidden"
    },
    popupInut: {
        fontSize:16,
        width: 270, 
        borderStyle: "solid", 
        borderColor: "#bdbdbd", 
        borderWidth: 1, 
        borderRadius:5,
        backgroundColor: "#fff",
        padding:0, 
        paddingRight: 25,

    },
    popupView: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop:25
    },
    cancelButton: {
        color:"#fff", 
        marginRight:3,flexDirection: 'row', 
        width: 149, 
        height: 50, 
        justifyContent: "center", 
        alignItems: 'center', 
        backgroundColor: '#606060'
    },
    okButton: {
        color:"#fff", 
        flexDirection: 'row', 
        width: 149, height: 50, 
        justifyContent: "center", 
        alignItems: 'center', 
        backgroundColor: '#606060'
    },
    plusButton: {
        padding:10, 
        flex: 1, 
        right: 5,
        position: 'absolute',
        bottom:5, 
        color:"#606060", 
        fontSize: 72
    },
    noContentText: {
        textAlign: "center",
        marginBottom: 5
    }
});