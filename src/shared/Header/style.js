import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    header: {
        backgroundColor: "#000",
        color: "#fff"
    },
    text: {
        color: "#fff"
    },
    ellipseMenuTrigger: {
        display: "flex", 
        width: 20, 
        height: 20, 
        justifyContent: "center", 
        alignItems: 'center',
    },
    ellipseIcon:{
        fontSize: 28,
        color: "#fff"
    },
    ellipseMenuOptions:{
        padding: 10,
        fontSize: 34,
        backgroundColor: "#686868"
    },
    ellipseMenuOptionItem: {
        color: "#fff"
    }
});