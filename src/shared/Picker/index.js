import React, { useState } from 'react'
import { Modal, Text, View, TouchableOpacity } from 'react-native'
import { style as sty } from "./style";
const Picker = props => {
    const [ isOpen, toggleModal ] = useState(false);
    let { value, items, placeholder, onChange, style } = props;
    
    if(!items ||items.length == 0 ) return null;

    const getValueLabel = () => {
        if(value){
            let item = items.find(el => el.value == value);
            if(item) return item.label;
        }

        return placeholder || items[0].label;
    }
    console.log("value", value);
    return  <>
                <TouchableOpacity onPress={() => toggleModal(!isOpen)}>
                    <Text style={[sty.valueLabel, style && style.text]}>{getValueLabel()}</Text>
                    <View style={sty.triangle} />
                </TouchableOpacity>
                <Modal
                    visible={isOpen}
                    transparent
                    onRequestClose={() => toggleModal(false)}
                >
                    <TouchableOpacity style={[sty.modalOverlay, style && style.overlay]} onPress={() => toggleModal(!isOpen)}>
                        <View style={[sty.modalBody, style && style.body]}>
                            {items.map((el, i) => 
                                <TouchableOpacity style={sty.touchables} key={i} onPress={() => {onChange && onChange(el); toggleModal(!isOpen)}}>
                                    <Text style={[
                                            sty.touchableText, 
                                            style && style.text,
                                            el.value == value && sty.active
                                        ]}>
                                        {el.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </>
}

export default Picker;
