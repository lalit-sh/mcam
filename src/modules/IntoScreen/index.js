import { View, ImageBackground, Image } from 'react-native'
import Text from '../../components/Text';
import React, { Component } from 'react'
import AppIntroSlider from 'react-native-app-intro-slider-custom';
import { AppStyle } from '../../App.style';
import { style } from './style';

const slides = [
    {
        key: 'one',
        title: 'EVERY FRIEND IS IMPORTANT',
        text: 'Create a group of all your friends no limit',
        image: require('../../assets/images/introscreen/1.png'),
    },
    {
        key: 'two',
        title: 'EVERY PICTURE TELLS A STORY',
        text: "Take awesome pictures And share it with every one in your group automatically and instantly.",
        image: require('../../assets/images/introscreen/2.png'),
    },
    {
        key: 'three',
        title: 'LIFE IS EASY',
        text: 'All of your images are auto sorted in seprate folders automatically, so no hassle to create new folders for different type of pictures.',
        image: require('../../assets/images/introscreen/3.png'),
    }
];


class IntroScreen extends Component {

    renderItem = (event) => {
        let { item } = event;
        return <View style={style.container}>
                    <Image source={item.image} style={style.image}/>
                    {item.title && 
                        <Text style={{...AppStyle.text, ...style.title}}>
                            {item.title}
                        </Text>
                    }
                    {item.text && 
                        <Text style={{...AppStyle.text, ...style.text}}>
                            {item.text}
                        </Text>
                    }
            </View> 
        // <View style={{...AppStyle.container, flex: 1}}>
            
        // </View>
    }

    onDone = () => {
        this.props.onDone();
    }

    render() {
        return (
            <AppIntroSlider 
                renderItem={this.renderItem} 
                data={slides} 
                onDone={this.onDone}
                // onSkip={this.onDone}
                showSkipButton={true}
            />
        ) 
    }
}


export default IntroScreen;