import React from "react";
import "./index.less";
import {
    Upload,
    Icon,
    message
} from "antd";
import store from "../../store";

export default class UploadImg extends React.Component {

    static defaultProps = {
        urls: [],
        limit: 0,
        disabled: false,
        onChange: () => {}
    }

    state = {
        uploadUrl: _ENV_.HOST + "/upload/adminUpload",
        images: []
    }

    componentDidMount () {
        this.setState({ images: (this as any).props.urls });
    }

    componentWillReceiveProps (props) {
        this.setState({ images: props.urls });
    }

    //上传logo之前进行判断
    beforeUpload (file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.warning('仅支持JPG和PNG格式');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.warning('logo不能大于2MB');
        }
        return isJpgOrPng && isLt2M;
    }

    //图片上传过程处理
    handleChange (info) {
        if (info.file.status === 'uploading') {
          this.setState({ uploadLoading : true });
          return;
        }
        if (info.file.status === 'done') {
            this.setState({uploadLoading: false});
            if (!info.file.response.url) {
                message.error(info.file.response.message || "上传出错");
                return;
            }
            const url = info.file.response.url;
            this.state.images.push(url);
            this.setState({});
            (this as any).props.onChange(this.state.images);
        }
    }

    //检查是否可以显示上传按钮
    checkShowUpload () {
        const props = (this as any).props, state = this.state;
        if (props.disabled) return false;
        else if (props.limit === 0) return true;
        else if (state.images <= props.limit) return true;
        else return false;
    }

    //删除图片
    deleteImg (index) {
        this.state.images.splice(index, 1);
        this.setState({});
        (this as any).props.onChange(this.state.images);
    }

    render (): any {
        const state: any = this.state, props = (this as any).props;
        return (
            <div className="upload-component">
                {state.images.map((i, index) => <div className="child">
                    <img src={i} alt=""/>
                    {this.checkShowUpload() && <div className="delete-btn" onClick={this.deleteImg.bind(this, index)}>
                        <Icon type="delete" style={{color: "red"}}/>
                    </div>}
                </div>)}
                {this.checkShowUpload() && <Upload
                name="file"
                headers={{
                    Authorization: "Bearer " + store.getState().token
                }}
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={state.uploadUrl}
                beforeUpload={this.beforeUpload.bind(this)}
                onChange={this.handleChange.bind(this)}
                >
                    <div>
                        <Icon type="plus"/>
                        <div className="ant-upload-text">上传图片</div>
                    </div>
                </Upload>}
            </div>
        );
    }
}