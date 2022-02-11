import React from "react";
import { Text as T } from "react-native";

const Text = ({children, style={}}) => {
    return  <T style={{fontFamily: "Cabin", ...style}}>
                {children}
            </T>
}

export default Text;