import React, { Component } from 'react'
import { TouchableOpacity, Image } from 'react-native'

const ImageThumb = (props) => {
        const { style, source, onPress} = props;
        return (  
            <TouchableOpacity  activeOpacity = { .5 } onPress={() => onPress()}>
                <Image 
                    source={{uri: `file://${source}`}} 
                    style={style}
                />
            </TouchableOpacity>
        )
}
export default ImageThumb;
