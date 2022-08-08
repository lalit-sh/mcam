import { Dimensions, StyleSheet } from "react-native";

let dw = Dimensions.get("screen").width;
let cw = dw - 15;
export const TimelineGalleryStyle = StyleSheet.create({
    gpContainer: {
        marginTop: 20,
        padding: 5
    },
    gpContainerTitle: {
        paddingLeft: 15,
        paddingBottom: 15,
        fontSize: 16,
        color: "#000",
        fontWeight: "bold"
    },
    gpImageContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        // justifyContent: "space-between",
        // alignContent: "space-between"
    },
    imageThumb: {
        marginBottom: 1,
        marginLeft: 1,
        width: cw / 5,
        height: cw / 5
    }
});

export const ImageModalStyle = StyleSheet.create({
    container:{
        flex:1, 
        position: "relative",
        backgroundColor: "#000"
    }
})