import React from 'react';
import { View } from 'react-native';

const getBoxStyle = (i) => {
    i = i+1;
    let bw = 0.5;
    let s = {
        width: "33%",
        height: "33%",
        borderColor: "#fff",
        borderLeftWidth: i%3 == 1 ? 0 : bw,
        borderRightWidth: (i%3) == 0 ? 0 : bw,
        borderBottomWidth: i >= 7 && i <= 9 ? 0 : bw,
        borderTopWidth: i <= 3 ? 0 : bw
    }
    return s;
}

const Grid = (props) => {
    return (
        <View style={{
                        height: props.height,
                        position: 'absolute',
                        zIndex: 1,
                        width: "101%",
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}>
            {Array(9).fill(1).map((el, i) => 
                <View style={getBoxStyle(i)} key={i} />
            )}
        </View>
        )
}

export default Grid;