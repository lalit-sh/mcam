import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container: {
        width: '100%', 
        height: '100%',
        backgroundColor: "#ffbc2c",
        display: "flex",
        flexDirection:'column',
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30
    },
    image: {
        // backgroundColor: "red",
        // alignSelf: "center",
        marginBottom: 30
    },
    title: {
        textAlign: "center",
        fontSize: 28,
        marginBottom: 30
        // fontWeight: "bold"
    },
    text: {
        textAlign: "center",
        fontSize: 18,
        // fontWeight: "bold"
    }
});