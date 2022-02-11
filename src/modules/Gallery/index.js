import { Container } from 'native-base';
import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { syncGalleryImages } from "../../redux/actions/app.actions";
import Header from "../../shared/Header";
import Loading from '../../shared/Loading';
import { TimelineGalleryStyle as style } from "./style";
import ImageThumbnail from "../../shared/ImageThumb";
import ImageSlider from "../../shared/ImageSliderModal";
import { AppStyle } from '../../App.style';
import { createNotification, displayNotification } from "../../utils/helpers/Notification.helpers";
class Gallery extends Component {
    
    state = {
        isImageViewOpen: false
    }

    componentDidMount() {
        this.props.syncGalleryImages();
    }

    handleThumbPress = (dirName, index, image) => {
        let { gallery } = this.props;
        let i = 0;
        for( let gl in gallery ){
            if(gl == dirName){
                i += index;
                break;
            }
            i += gallery[gl].length;
        }

        let noti = createNotification("test", "Test", "test");
        noti.setData({
            "image": "some image file"
        })
        displayNotification(noti);

        this.setState({ isImageViewOpen: true, activeImageIndex: i, activeImage: image })
    }

    closeImageView = () => {
        this.setState({ isImageViewOpen: false })
    }

    isGallery = () => {
        let { gallery } = this.props;
        if(!gallery || (gallery && Object.keys(gallery).length == 0))
            return false;
        return true;
    }

    getContent = () => {
        let { gallery, loading } = this.props;
        if(loading)
            return <Loading />
        
        if(!loading && !this.isGallery()){
            return  <View style={{marginTop: 50}}>
                        <Text style={{textAlign: 'center'}}> No image to display </Text>
                    </View>
        }
        let groups = Object.keys(gallery);
        return groups.map((el, i) =>
            <View key={i} style={style.gpContainer}>
                <Text style={[style.gpContainerTitle, AppStyle.text]}>{el}</Text>
                <View style={style.gpImageContainer}>
                    {gallery[el].map((image, j) => 
                        <ImageThumbnail 
                            style={style.imageThumb} 
                            source={image.path} 
                            onPress={() => this.handleThumbPress(el, j, image)}
                            key={"im" + j}
                        />
                    )}
                </View>
            </View>
        )
    }
    
    onFilesDelete = (imageData, index) => {
        this.props.syncGalleryImages();
    }

    render() {
        let { gallery } = this.props;
        let { isImageViewOpen, activeImageIndex } = this.state;
        return (
            <View style={AppStyle.container}>
                <Header {...this.props} isBack={true} title="Gallery"/>
                <ScrollView contentContainerStyle={{paddingBottom: 30}} style={{marginBottom: 50}}>
                    {this.getContent()}
                </ScrollView>
                {this.isGallery() &&
                    <ImageSlider 
                        isOpen={isImageViewOpen}
                        onClose={this.closeImageView}
                        images={gallery && Object.values(gallery).flat(1)}
                        index={activeImageIndex}
                        onDelete={this.onFilesDelete}
                    />
                }
            </View>
        )
    }
}


function mapDispathToProps(dispatch) {
    return bindActionCreators({ syncGalleryImages }, dispatch);
}

const mapStateToProps = (state) => ({
    gallery: state.AppData.gallery,
    loading: state.AppData.loading
});

export default connect(mapStateToProps, mapDispathToProps)(Gallery);