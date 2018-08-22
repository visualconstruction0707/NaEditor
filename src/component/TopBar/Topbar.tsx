import React from 'react';
import { Icon } from '../../../node_modules/antd';
import Cookies from 'js-cookie';

interface TopbarProps {
}

interface TopbarState {
}

const { BASE_DATA } = (window as any);
const { pageId, dbSource, username } = BASE_DATA;

class Topbar extends React.Component<TopbarProps, TopbarState> {

    constructor(props: TopbarProps) {
        super(props);
    }

    preview = () => {
        (document.querySelector('.J_previewWrap') as any).classList.add('active');
        (document.querySelector('.J_previewContainer') as any).innerHTML = `
		<iframe class="cd-canvas J_canvas" src="/page/preview.html?pageId=${pageId}&type=1&dbSource=${dbSource}">                
		</iframe>`;
    }

    logout = () => {
        Cookies.remove('pin');
        location.href = '/api/page/login';
    }

    render() {
        return (
            <div className="d-top-bar">
                <div className="d-left">
                    <div className="d-logo">
                        <img src="//naeditor-image.oss-cn-shenzhen.aliyuncs.com/timg.jpg?x-oss-process=image/resize,w_30" />
                    </div>
                    <h2>NaEditor</h2>
                </div>
                <div className="d-right">
                    <div className="d-line"></div>
                    <div
                        className="J_preview d-preview"
                        onClick={this.preview}
                    >预览</div>
                    <div className="d-line"></div>
                    <div className="J_publish d-publish">发布</div>
                    <div className="d-line"></div>
                    <div className="d-username">
                        <span>{username}</span>
                        <Icon type="logout" onClick={this.logout} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Topbar;
