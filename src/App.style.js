import { StyleSheet } from "react-native";

export const bgColor = "#000";
export const fontColor = "#fff";
export const highlightColor = "rgba(228, 233, 237, 0.3)"
export const highlightOnColor = "#2bc20e"

export const AppStyle = StyleSheet.create({
    container: {
        backgroundColor: bgColor
    },
    text: {
        color: fontColor,
        fontFamily: "Cabin"
    },
    input: {
        fontFamily: "Cabin",
        backgroundColor: highlightColor,
        color: fontColor,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 5,
        fontSize: 18
    },
    highlighted: {
        backgroundColor: highlightColor
    },
    highlightedText: {
        color: highlightColor
    },
    highlightOnText: {
        color: highlightOnColor
    },
    highlightOnBackground: {
        backgroundColor: highlightOnColor
    },
    btn: {
        padding: 10,
        borderRadius: 5
    },
    btnBig: {
        padding: 15
    },
    primaryBtn: {
        backgroundColor: "#255ff2",
        padding: 10
    },
    dangerBtn: {
        backgroundColor: "#d32f2f",
        padding: 10
    },
    warningBtn: {
        backgroundColor: "#f9c20a",
        padding: 10
    },
    textCenter: {
        textAlign: "center"
    },
    textRight: {
        textAlign: "right"
    },
    textLeft: {
        textAlign: "left"
    },
    flexCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    linkText: {
        color: "#3895d3"
    },
    marginTop10: {
        marginTop: 10
    },
    marginTop20: {
        marginTop: 20
    },
    marginBtm10: {
        marginBottom: 10
    },
    marginBtm20:{
        marginBottom: 20
    }
});