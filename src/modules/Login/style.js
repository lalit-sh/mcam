import { StyleSheet } from "react-native"
import { successBgColor, primaryBgColor } from "../../utils/constants/style.constants";

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 50,
        paddingRight: 50,
        paddingBottom: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        display: 'flex', 
        alignItems: 'center'
    },
    logo: {
        marginBottom: 50, 
        // marginTop: 50
    },
    inputContainer: {
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: "row",
        marginBottom: 30
    },
    submit: {
        // position: 'absolute',
        // bottom:0,
        // width: 100
    },
    backArrow:{
        position: "absolute",
        fontSize: 32,
        left: 20,
        top: 20
    }
})

export default style;