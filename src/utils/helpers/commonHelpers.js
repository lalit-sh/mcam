import * as config from "../config";
import AsyncStorage from "@react-native-community/async-storage";
import { ACCESS_TOKEN } from "../constants/common.constants";

export const getAuthToken = async () => {
    return await AsyncStorage.getItem(ACCESS_TOKEN); 
}


export const getHeightForRatio = (height, width, ratio) => {
    let hght = height;
    ratio = ratio.split(":")
    let h = ratio[0]
    let w = ratio[1]
    hght = (h*width/w);
    if(height - hght < 200) return height;
    if(hght < 100) return 100;
    return hght;
}
