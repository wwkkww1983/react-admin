import React from "react";
import "./index.less";
import { Modal, Table, Button, Input, Form, Popover } from "antd";
import NProgress from "nprogress";
import { getAgentList } from "../../api/agent";
import { input, property as P } from "../../utils/utils";

/**
 * 选择代理商组件
 * 一般在代理商系列页面里边用到 
 */

interface Props {
    title: string,
    onOk (any): void,
    onCancel (): void
}

export default class AgentSelect extends React.Component {
    constructor (props) {
        super(props);
    };

    static defaultProps: Props = {
        title: "选择代理商",
        onOk () {},
        onCancel () {}
    }

    state = {
        columns: [
            {
                title: "id",
                dataIndex: "id",
                width: "15%"
            },
            {
                title: "姓名",
                dataIndex: "name",
                width: "15%"
            },
            {
                title: "手机号",
                dataIndex: "phone",
                width: "15%"
            },
            {
                title: "地区/地址",
                dataIndex: "address",
                width: "15%"
            },
            {
                title: "乐刷信息",
                width: "15%",
                render: item => {
                    const content: React.ReactNode = <p>{P(item, "leshua.config.key")}</p>;
                    return <div>
                        <span>乐刷商户号：{P(item, "leshua.config.merchantId")}</span>
                        <br/>
                        <span>
                            乐刷key：
                            <Popover content={content} title="乐刷key">
                                <Button type="link">查看</Button>
                            </Popover>
                        </span>
                    </div>
                }
            },
            {
                title: "操作",
                width: "15%",
                render: item => (
                    <Form layout="inline">
                        <Form.Item>
                            <Button icon="check" onClick={(this as any).props.onOk.bind(null, item)}>选择</Button>
                        </Form.Item>
                    </Form>
                )
            },
        ],
        searchText: "",
        list: [],
        page: 1,
        limit: 10,
        total: 0
    }

    componentDidMount () {
        this.loadList();
    }

     //加载代理商列表
     async loadList (loading = true) {
        loading && NProgress.start();
        let res = null;
        try {
            res = await getAgentList({
                q: this.state.searchText,
                page: this.state.page,
                limit: this.state.limit
            });
        } catch(err) {
            loading && NProgress.done();
            return;
        }
        loading && NProgress.done();
        this.setState({
            list: res.list,
            total: res.total
        });
    }

    render (): React.ReactNode {
        const state = this.state, props = (this as any).props;
        return <Modal
        width="80%"
        title={props.title}
        visible={true}
        maskClosable={false}
        onCancel={props.onCancel}
        footer={null}
        >
            <Form layout="inline">
                <Form.Item>
                    <Input placeholder="搜索" onChange={input.bind(this, "searchText")} value={state.searchText}></Input>
                </Form.Item>
                <Form.Item>
                    <Button icon="search" onClick={this.loadList.bind(this)}>查找</Button>
                </Form.Item>
            </Form>
            <Table
            scroll={{y: 400}}
            style={{marginTop: "16px"}}
            columns={state.columns}
            dataSource={state.list}
            pagination={{
                current: state.page,
                pageSize: state.limit,
                total: state.total,
                onChange: page => {
                    state.page = page;
                    this.loadList();
                }
            }}
            />
        </Modal>
    }
}