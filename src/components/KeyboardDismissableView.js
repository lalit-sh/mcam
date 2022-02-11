import React from "react";
import { Keyboard,  TouchableWithoutFeedback } from 'react-native';

const KeyboardDismissableView = ({ children }) => (
    <TouchableWithoutFeedback 
    onPress={() => {Keyboard.dismiss()}} accessible={false}> 
        {children}
    </TouchableWithoutFeedback>
);

export default KeyboardDismissableView;