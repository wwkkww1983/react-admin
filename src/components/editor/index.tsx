import React from "react";
import "./index.less";
import E from "wangeditor";
import { uploadImg } from "../../api/upload";
import NProgress from "nprogress";

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

    componentWillReceiveProps (props) {
        if (this.state.editor && props.content !== this.state.editor.txt.html()) {
            this.state.editor && this.state.editor.txt.html(props.content);
        }
    }

    componentWillUnmount () {
        this.state.editor && this.state.editor.destroy(), this.state.editor = null;
    }

    init () {
        setTimeout(() => {
            const editor: any = this.state.editor = new E((this as any).refs["editor"]);
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
        });
    }

    render (): React.ReactNode {
        const state = this.state, props = this.props;
        return <div className="editor-component" ref="editor"></div>
    }
}