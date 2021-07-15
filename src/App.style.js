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
        color: fontColor
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
    btnBig: {
        padding: 15
    },
    dangerBtn: {
        backgroundColor: "#d32f2f",
        padding: 10
    },
    textCenter: {
        textAlign: "center"
    },
    flexCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    linkText: {
        color: "#3895d3"
    },
    marginBtm10: {
        marginBottom: 10
    },
    marginBtm20:{
        marginBottom: 20
    }
});