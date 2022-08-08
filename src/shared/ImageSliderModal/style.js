import { StyleSheet } from "react-native";


const hfBgColor = "rgba(0,0,0, 0.2)";

export const style = StyleSheet.create({
    container:{
        flex:1, 
        position: "relative",
        backgroundColor: "#000"
    },
    moveBox: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    animatedHeader: {
        position: "absolute", zIndex: 99, left: 0, right: 0, 
    },
    header:{
        backgroundColor: hfBgColor,
        height: 80
    },
    footer: {
        backgroundColor: hfBgColor,
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: "center", 
        padding: 20,
    },
    footerIcon: {
        fontSize: 22,
        marginBottom: 5
    },
    footerText: {
        color: "#fff",
        fontSize: 12
    },
    animatedFoter: {
        position: "absolute",
        bottom: 0,
        zIndex: 99,
        left: 0,
        right: 0
    }
})