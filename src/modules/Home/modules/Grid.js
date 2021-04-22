import React from 'react';
import { View } from 'react-native';
import { gridStyle as styles } from '../style';

const Grid = (props) => {
    return (
        // style={{height: props.height}}
        <View>
            <View style={{
            flex: 1, flexDirection: "row", zIndex: 1
            }}>
                <View style={styles.box} />
                <View style={styles.box} />
                <View style={styles.box} />
            </View>
            <View style={{
            flex: 1, flexDirection: "row", zIndex: 1, top: 230
            }}>
                <View style={styles.box} />
                <View style={styles.box} />
                <View style={styles.box} />
            </View>
            <View style={{
            flex: 1, flexDirection: "row", zIndex: 1, top: 460
            }}>
                <View style={styles.box} />
                <View style={styles.box} />
                <View style={styles.box} />
            </View>
        </View>
        )
}

export default Grid;