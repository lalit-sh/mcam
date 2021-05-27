import { Container, Icon } from 'native-base';
import React, { Component } from 'react'
import { Text, View, Modal, Animated, Dimensions, Easing, I18nManager, TouchableOpacity } from 'react-native'
import Header from "../Header";
import { style } from "./style";
import ImageZoom from "react-native-image-pan-zoom";
// import ImageViewer from 'react-native-image-zoom-viewer';
import ScaledImage from "../../shared/ScaledImage";
import Share from "react-native-share"; 
import { removeFile, removeFiles } from '../../utils/helpers/localStorageHelpers';

const ww = Dimensions.get('window').width;
const wh = Dimensions.get('window').height;


class ImageSliderModal extends Component {

    state = {
        currentShowIndex: 0,
        prevIndexProp: 0,
        images: []
    }
    standardPositionX = 0;
    positionXNumber = 0;
    positionX = new Animated.Value(0);
    defaultHideValue = 100;
    headerPositionY = new Animated.Value(-this.defaultHideValue);
    footerPositionY = new Animated.Value(this.defaultHideValue);
    width = ww
    pageAnimateTime = 300
    useNativeDriver = true
    headerFooterAnimationTime = 100
    headerFooterAutoHideTime = 3000
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.index !== prevState.prevIndexProp) {
            return { currentShowIndex: nextProps.index, prevIndexProp: nextProps.index };
        }

        if(nextProps.images && nextProps.images.length != prevState.images){
            return { images: nextProps.images };
        }
        return null;
    }

    componentDidMount() {
        this.jumpToCurrentImage();
    }
    

    renderImage = (props) => {
        return  <ScaledImage 
                    source={{
                            uri: `${props.source.uri}`, 
                            width: ww
                        }}
                    resizeMode="contain"
                />
    }

    handleResponderRelease = (vx) => {
        const vxRTL = I18nManager.isRTL ? -vx : vx;
        const isLeftMove = I18nManager.isRTL
        ? this.positionXNumber - this.standardPositionX < 0
        : this.positionXNumber - this.standardPositionX > 0;
        const isRightMove = I18nManager.isRTL
        ? this.positionXNumber - this.standardPositionX > 0
        : this.positionXNumber - this.standardPositionX < 0;
        if (vxRTL > 0.7) {
            this.goBack();
            // if (this.state.currentShowIndex || 0 > 0) {
            //     this.loadImage((this.state.currentShowIndex || 0) - 1);
            // }
            return;
        } else if (vxRTL < -0.7) {
            this.goNext();
            // if (this.state.currentShowIndex || 0 < this.props.imageUrls.length - 1) {
            //     this.loadImage((this.state.currentShowIndex || 0) + 1);
            // }
            return;
        }

        if (isLeftMove) {
            this.goBack();
        } else if (isRightMove) {
            this.goNext();
            return;
        } else {
            this.resetPosition();
            return;
        }
    }

    goBack = () => {
        if (this.state.currentShowIndex === 0) {
            this.resetPosition();
            return;
        }
    
        this.positionXNumber = !I18nManager.isRTL
            ? this.standardPositionX + this.width
            : this.standardPositionX - this.width;
        this.standardPositionX = this.positionXNumber;
        Animated.timing(this.positionX, {
            toValue: this.positionXNumber,
            duration: this.pageAnimateTime,
            useNativeDriver: !!this.useNativeDriver
        }).start();
    
        const nextIndex = (this.state.currentShowIndex || 0) - 1;
    
        this.setState({
            currentShowIndex: nextIndex
        });
    }

    goNext = () => {
        if (this.state.currentShowIndex === this.props.images.length - 1) {
            this.resetPosition();
            return;
        }
    
        this.positionXNumber = !I18nManager.isRTL
            ? this.standardPositionX - this.width
            : this.standardPositionX + this.width;
        this.standardPositionX = this.positionXNumber;
        Animated.timing(this.positionX, {
            toValue: this.positionXNumber,
            duration: this.pageAnimateTime,
            useNativeDriver: !!this.useNativeDriver
        }).start();
    
        const nextIndex = (this.state.currentShowIndex || 0) + 1;

        this.setState({
            currentShowIndex: nextIndex
        });
    }

    resetPosition = () => {
        this.positionXNumber = this.standardPositionX;
        Animated.timing(this.positionX, {
            toValue: this.standardPositionX,
            duration: 150,
            useNativeDriver: !!this.useNativeDriver
        }).start();
    }    

    handleHorizontalOuterRangeOffset = (offsetX) => {
        this.positionXNumber = this.standardPositionX + offsetX;
        this.positionX.setValue(this.positionXNumber);
    }

    handleSwipeDown = () => {
        this.props.onClose();
    }

    handleClick = () => {
        let toValue = 0;
        if(this.t) clearTimeout(this.t)
        if(this.isVisible){
            toValue = this.defaultHideValue;
        }else{
            this.t = setTimeout(() => {
                this.toggleHeaderView(-this.defaultHideValue);
                this.toggleFooterView(this.defaultHideValue);
            }, this.headerFooterAutoHideTime)
        }
        this.toggleFooterView(toValue);
        this.toggleHeaderView(-toValue);
        this.isVisible = !this.isVisible;
    }

    toggleFooterView = (toValue) => {
        Animated.timing(this.footerPositionY, {
            toValue,
            duration: this.headerFooterAnimationTime,
            // easing: Easing.linear,
            useNativeDriver: this.useNativeDriver
        }).start()
    }

    toggleHeaderView = (toValue) => {
        Animated.timing(this.headerPositionY, {
            toValue,
            duration: this.headerFooterAnimationTime,
            // easing: Easing.linear,
            useNativeDriver: this.useNativeDriver
        }).start()
    }

    jumpToCurrentImage() {
        this.positionXNumber = this.width * (this.state.currentShowIndex || 0) * (I18nManager.isRTL ? 1 : -1);
        this.standardPositionX = this.positionXNumber;
        this.positionX.setValue(this.positionXNumber);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.index !== this.props.index || !prevProps.isOpen && this.props.isOpen ) {
            this.jumpToCurrentImage();
        }
    }

    getImage = (data, index) => {
        const { currentShowIndex } = this.state;
        if((currentShowIndex || 0) > (index + 1) || (currentShowIndex || 0) < (index - 1)){
            return null;
        }
        return  <ScaledImage 
                    source={{
                            uri: `file:${data.path}`, 
                            width: ww
                        }}
                />
    }

    handleImageShare = async () => {
        try{
            let image = this.props.images[this.state.currentShowIndex];
            if(!image || !image.path) return false;
            await Share.open({
                url: `file://${image.path}` 
            });
        }catch(err){
            console.log("Image share: ", err);
        }
    }

    handleImageDelete = async () => {
        let i = this.state.currentShowIndex;
        let images = this.state.images;
        let image = images[i];
        let res = await removeFile(image.path);
        if(res){
            images.splice(i, 1);
            this.setState({
                images: images
            });
            if(this.props.onDelete)
                return this.props.onDelete(image, this.state.currentShowIndex);
        }
    }

    render() {
        const { isOpen, onClose } = this.props;
        const { images } = this.state;
        return (
            <Modal
                visible={isOpen} 
                animationType={"fade"}
                presentationStyle={"fullScreen"}
                onRequestClose={onClose}
            >
                <Container style={style.container}>
                    <Animated.View style={[style.animatedHeader, {transform: [{translateY: this.headerPositionY}]}]}>
                        <Header isBack={true} onBack={onClose} style={style.header}/>
                    </Animated.View>
                    <Animated.View
                        style={{
                            ...style.moveBox,
                            transform: [{ translateX: this.positionX }],
                            width: ww * images.length
                        }}
                    >  
                        {images.map((el, i) => 
                            <ImageZoom
                                key={i}
                                cropWidth={ww}
                                cropHeight={wh}
                                horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset}
                                responderRelease={this.handleResponderRelease}
                                onClick={this.handleClick}
                                enableSwipeDown={true}
                                onSwipeDown={this.handleSwipeDown}
                                pinchToZoom={true}
                                enableDoubleClickZoom={true}
                                imageWidth={ww}
                                imageHeight={wh}
                                doubleClickInterval={0}
                            >
                                <View 
                                    style={{flex:1,
                                        flexDirection:'row',
                                        alignItems:'center',
                                        justifyContent:'center'}}>
                                    {this.getImage(el, i)}
                                </View>
                            </ImageZoom>
                        )}
                    </Animated.View>
                    <Animated.View style={[style.animatedFoter, {transform: [{translateY: this.footerPositionY}]}]}>
                        <Footer onDelete={this.handleImageDelete} onShare={this.handleImageShare}/>
                    </Animated.View>
                </Container>
            </Modal>
        )
    }
}

const Footer = props => {
    return  <View style={{...style.footer, ...props.style}}>
                <TouchableOpacity onPress={props.onDelete} style={{alignItems: "center"}}>
                    <Icon type="AntDesign" name="delete" style={[style.footerText, style.footerIcon]}/>
                    <Text style={{...style.footerText, marginTop: 3}}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onShare} style={{alignItems: "center"}}>
                    <Icon type="AntDesign" name="sharealt" style={[style.footerText, style.footerIcon]}/>
                    <Text style={{...style.footerText, marginTop: 3}}>Share</Text>
                </TouchableOpacity>
            </View>
}

export default ImageSliderModal;
