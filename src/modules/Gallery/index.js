import { Container } from 'native-base';
import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import Text from "../../components/Text";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { syncGalleryImages, removeGalleryImage } from "../../redux/actions/app.actions";
import Header from "../../shared/Header";
import Loading from '../../shared/Loading';
import { TimelineGalleryStyle as style } from "./style";
import ImageThumbnail from "../../shared/ImageThumb";
import ImageSlider from "../../shared/ImageSliderModal";
import { AppStyle } from '../../App.style';
import { createNotification, displayNotification } from "../../utils/helpers/Notification.helpers";
import moment from 'moment';
import { LOCAL_STORAGE_PATH } from "../../utils/config";
class Gallery extends Component {
    
    state = {
        isImageViewOpen: false
    }

    componentDidMount() {
        let { gallery, galleryLastSyncTime } = this.props.AppData;
        if(!gallery || (galleryLastSyncTime && moment().diff(moment(galleryLastSyncTime), 'minutes') > 30)){
            this.props.syncGalleryImages();
        }
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

        // let noti = createNotification("test", "Test", "test");
        // noti.setData({
        //     "image": "some image file"
        // })
        // displayNotification(noti);

        this.setState({ isImageViewOpen: true, activeImageIndex: i, activeImage: image})
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
            return  <View style={{...AppStyle.flexCenter}}>
                        <Text style={{...AppStyle.text, fontSize: 16}}> 
                            No images available 
                        </Text>
                    </View>
        }

        let groups = Object.keys(gallery);
        return groups.map((el, i) =>
            <View key={i} style={style.gpContainer}>
                <Text style={{...style.gpContainerTitle, ...AppStyle.text}}>{el}</Text>
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
        let path = imageData.path;
            path = path.split(LOCAL_STORAGE_PATH);
        if(path && path.length > 0){
            path = path[1];
            if(path){
                let group = path.split("/");
                if(group.length > 0){
                    group = group[1];
                }
                if(group){
                    this.props.removeGalleryImage(group, imageData.path)
                    return;
                }
            }
        }
        this.props.syncGalleryImages();
    }

    render() {
        let { gallery } = this.props;
        let { isImageViewOpen, activeImageIndex } = this.state;
        return (
            <View style={{...AppStyle.container, ...AppStyle.flex}}>
                <Header {...this.props} isBack={true} title="Gallery"/>
                <ScrollView contentContainerStyle={{paddingBottom: 30, flex: 1}} style={{marginBottom: 50, flex: 1}}>
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
    return bindActionCreators({ syncGalleryImages, removeGalleryImage }, dispatch);
}

const mapStateToProps = (state) => ({
    gallery: state.AppData.gallery,
    loading: state.AppData.loading,
    AppData: state.AppData
});

export default connect(mapStateToProps, mapDispathToProps)(Gallery);