import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    modalBody: {
        position: "absolute",
        backgroundColor: "#fff",
        width: "80%",
        maxWidth: 300,
        padding: 10,
        borderRadius: 3
    },
    touchables:{
        padding: 10
    },
    touchableText:{
        fontSize: 18
    },
    active: {
        fontWeight: "bold"
    },
    valueLabel: {
        paddingRight: 30,
        fontSize: 14
    },
    triangle: {
        position: "absolute",
        right: 0,
        top: 7,
        borderTopWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 0,
        borderLeftWidth: 5,
        borderTopColor: "#fff",
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    }
});