import { StyleSheet } from "react-native"
import { successBgColor, primaryBgColor } from "../../utils/constants/style.constants";
const style = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    logoContainer: {

    },
    form: {
        width: "100%", marginBottom: 30, marginTop: 50
    },
    loginButton: {
        width: "100%", justifyContent: "center", marginBottom: 20, marginTop: 10, backgroundColor: successBgColor
    },
    registerButton: {
        width: "100%", justifyContent: "center", marginBottom: 50, marginTop: 10,
        backgroundColor: primaryBgColor,
    },
    registerButtonText: {
        color: "#fff"
    },
    input: {

    }
})

export default style;