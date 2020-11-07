import React from "react";
import "./index.less";
import E from "wangeditor";
import { uploadImg } from "../../api/upload";
import NProgress from "nprogress";

//编辑器container id计数
let CONTAINER_ID  = 0;

const menus = [
    'head',
    'bold',
    'fontSize',
    'fontName',
    'italic',
    'underline',
    'strikeThrough',
    'indent',
    'lineHeight',
    'foreColor',
    'backColor',
    'link',
    'list',
    'justify',
    'quote',
    'emoticon',
    'image',
    'video',
    'table',
    'code',
    'splitLine',
    'undo',
    'redo',
];

export default class Editor extends React.Component {
    constructor (props) {
        super(props);
    }

    static defaultProps = {
        content: "",
        placeholder: "富文本编辑器",
        disabled: false,
        onChange: () => {}
    }

    state = {
        containerId: "",
        editor: null
    }

    componentDidMount () {
        this.init();
    }

    init () {
        this.setContainerId();
        setTimeout(() => {
            const editor: any = this.state.editor = new E("#" + this.state.containerId);
            editor.config.menus = menus;
            editor.config.placeholder = (this as any).props.placeholder;
            editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
                const urls = [];
                NProgress.start();
                for (let file of resultFiles) {
                    const formData: any = new FormData();
                    formData.append("file", file);
                    try {
                        var res: any = await uploadImg(formData);
                    } catch(err) {
                        NProgress.done();
                        return;
                    }
                    urls.push(res.url);
                }
                NProgress.done();
                if (urls.length !== resultFiles.length) return;
                urls.forEach(url => insertImgFn(url));
            }
            editor.config.onchange = newHtml => {
                (this as any).props.onChange(newHtml);
            }
            editor.create();
            if ((this as any).props.content) editor.txt.html((this as any).props.content);
            if ((this as any).props.disabled) editor.disable();
        }, 100);
    }

    private setContainerId () {
        if (CONTAINER_ID === Number.MAX_SAFE_INTEGER) CONTAINER_ID = 0;
        CONTAINER_ID++;
        this.state.containerId = "editor-component-container-" + CONTAINER_ID;
        this.setState({});
    }

    render (): React.ReactNode {
        const state = this.state, props = this.props;
        return <div className="editor-component" id={state.containerId}></div>
    }
}