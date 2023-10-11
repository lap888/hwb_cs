/*
 * @Author: fantao.meng 
 * @Date: 2019-04-12 14:40:27 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-04 01:00:25
 */

import { connect } from 'react-redux';
import { Carousel, Card, Table, Divider, Modal, Form, Input, Icon, Select, AutoComplete, message, Checkbox, Button, Dragger, Upload } from 'antd';
import { Colors } from 'theme';
import { Send, uploadImage } from 'HttpPost';
import Config from 'config';
import { BANNER_SOURCE } from '../../constants/system';
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
};

class SystemBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceTab: 0,
            // 展示数据
            systemBannerList: [],
            // 表格数据
            bannerList: [],
            isLoading: true,
            currentPage: 1,
            totalNumber: 1,
            // 操作弹框
            visible: false,
            confirmLoading: false,
            autoDataSource: [{ value: -1, text: '与游戏不相关' }],

            // Form
            bannerId: 0,
            title: "",
            queue: 1,
            source: 0,
            gameId: 0,
            type: -1,           // ""、screen、screen、url
            screen: "",
            imageUrl: "",
            fileList: [],
        }
    }

    componentDidMount () {
        this.systemBanner(1, 1);
        this.systemBanner(1);
    }

    /**
     * 获取用户列表
     */
    systemBanner (page, status) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('App.systemBanner', { page, source: this.state.sourceTab, status, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                if (status === undefined) {
                    // 表格数据
                    if (page === 1) {
                        that.setState({ currentPage: page, bannerList: list, totalNumber });
                    } else {
                        let bannerListTemp = [...that.state.bannerList];
                        that.setState({ currentPage: page, bannerList: bannerListTemp.concat(list), totalNumber })
                    }
                } else {
                    // 展示数据
                    that.setState({ systemBannerList: list });
                }
            }
        });
    }

    /**
     * 获取自动关联游戏列表
     */
    fetchListGameList (value) {
        var that = this;
        Send('App.likeGameList', { searchText: value, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { list } = response['data'];
                list.splice(0, 0, { value: -1, text: '与游戏不相关' });
                that.setState({ autoDataSource: list });
            }
        });
    }

    /**
     * 上、下线轮播位
     */
    onlineBanner (bannerId, status) {
        var that = this;
        Send('App.onlineBanner', { bannerId, status, _uid: this.props.userId }, response => {
            if (response['success']) {
                message.success(`${status === 0 ? '下线' : '上线'}成功`);
                that.systemBanner(1, 1);
                that.systemBanner(1);
            }
        });
    }

    /**
     * 上传轮播位图片
     */
    uploadBannerImage (e) {
        uploadImage({
            type: "banner",
            path: e.file.name,
            uid: this.props.userId,
        }, response => {
            // console.log(response);
            // 分发当前上传图片
            this.setState({ imageurl: "uploads/banners/myll.jpg" });
            if (response['success']) {
                this.setState({ imageurl: "uploads/banners/myll.jpg" });
            } else {
                message.error(response['errMsg'])
            }
        })
    }

    /**
     * 切换Tab
     */
    onTabChange = (key, type) => {
        this.setState({ [type]: key }, () => {
            this.systemBanner(1, 1);
            this.systemBanner(1);
        });
    }
    
    handleTypeChange(e, key) {
        this.setState({ type: e.target.checked ? key : -1 });
    }

    /**
     * 关联游戏ID
     */
    handleAutoSelect(value) {
        this.setState({ gameId: value });
    }

    /**
     * 游戏名称自动补全
     */
    handleAutoSearch (value) {
        if (value.trim() !== '') this.fetchListGameList(value);
    }

    /**
     * 编辑轮播位
     */
    handleOk () {
        var that = this;
        let { bannerId, title, queue, source, gameId, imageUrl } = this.state;
        if (title.trim() === "") { message.warn('轮播位标题为必填项'); return }
        if (imageUrl.trim() === "") { message.warn('轮播位图片地址为必填项'); return }

        if (!that.state.confirmLoading) that.setState({ confirmLoading: true });
        Send(bannerId ? 'App.updateBanner' : 'App.submmitBanner', { bannerId, title, imageUrl, queue, source, params: this.combineParams(), _uid: this.props.userId }, response => {
            if (that.state.confirmLoading) that.setState({ confirmLoading: false });
            if (response['success']) {
                that.systemBanner(1);
                message.success(`轮播位${bannerId ? '编辑' : '创建'}成功，马上上线吧`);
            }
            that.setState({ visible: false }, () => that.setState({ bannerId: 0, title: '', imageUrl: "", queue: 1, source: 0, gameId: 0, type: -1, route: "", screen: "" }));
        });
    }

    /**
     * 取消轮播位编辑
     */
    handleCancel () {
        this.setState({ visible: false }, () => this.setState({ bannerId: 0, title: '', imageUrl: "", queue: 1, source: 0, gameId: 0, type: -1, route: "", screen: "" }));
    }

    /**
     * 拼接Params字段
     */
    combineParams () {
        let { type, gameId, screen } = this.state;
        if (type === "" || type === -1) {
            return JSON.stringify({})
        } else if (type === 'game') {
            return JSON.stringify({type:"game",route:"GameDetail",extras:{"id":gameId}});
        } else if (type === 'screen') {
            return JSON.stringify({type:"screen",route:screen});
        } else if (type === 'url') {
            return JSON.stringify({type:"url",url:screen});
        }
        return JSON.stringify({});
    }
    
    /**
     * 操作轮播图
     */
    intentToOperation (record) {
        if (this.state.visible) return;
        if (record.hasOwnProperty('id')) {
            let { id, title, imageurl, queue, source, params } = record;
            let paramsJson = JSON.parse(params);
            let type = -1;
            let screen = "";
            let gameId = 0;
            if (paramsJson.hasOwnProperty('type')) {
                type = paramsJson['type'];
                screen = paramsJson['type'] === 'url' ? paramsJson['url'] : paramsJson['route'];
                if (paramsJson['type'] === 'game' && paramsJson.hasOwnProperty('extras') && paramsJson.extras.hasOwnProperty('id')) gameId = paramsJson['extras']['id'];
            }
            if (!this.state.visible) this.setState({ bannerId: id, title, imageUrl: imageurl, queue, source, type, screen, gameId }, () => this.setState({ visible: true }));
        } else {
            if (!this.state.visible) this.setState({ visible: true });
        }
    }

    renderParamsForm () {
        let { autoDataSource, type, screen } = this.state;
        switch (type) {
            case "game":
                return (
                    <Form.Item
                        label="相关游戏"
                        {...formItemLayout}>
                        <AutoComplete
                            style={{ width: 200 }}
                            dataSource={autoDataSource}
                            onSelect={value => this.handleAutoSelect(value)}
                            onSearch={value => this.handleAutoSearch(value)}
                            placeholder="输入游戏名称"
                        />
                    </Form.Item>
                )
            case "screen":
                return (
                    <Form.Item
                        label="界面"
                        {...formItemLayout}>
                        <Input
                            style={{ width: 200 }}
                            type="user"
                            autoComplete="new-password"
                            prefix={<Icon type="apple" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入界面名称"
                            value={screen}
                            onChange={e => this.setState({ screen: e.target.value })} 
                        />
                    </Form.Item>
                )
            case "url":
                return (
                    <Form.Item
                        label="外部网址"
                        {...formItemLayout}>
                        <Input
                            style={{ width: 200 }}
                            type="user"
                            autoComplete="new-password"
                            prefix={<Icon type="ie" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入网址"
                            value={screen}
                            onChange={e => this.setState({ screen: e.target.value })} 
                        />
                    </Form.Item>
                )
            default:
                return <div />;
        }
    }

    renderUpload () {
        const props = {
            name: 'file',
            beforeUpload: (file) => console.log(file),
            customRequest: (e) => this.uploadBannerImage(e),
            onChange: (info) => {
                // console.log(info);
                this.setState({ fileList: [info.fileList[info.fileList.length - 1]] })
                const status = info.file.status;
                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
            fileList: this.state.fileList,
            listType: 'picture',
            onRemove: e => this.setState({ fileList: [], imageUrl: "" })
        };
        return (
            <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
            </Upload.Dragger>
        )
    }

    renderModal () {
        let { visible, confirmLoading, bannerId, title, imageUrl, queue, source, type, gameId, params } = this.state;
        return (
            <Modal
                title={`${bannerId ? '编辑' : '创建'}轮播位`}
                visible={visible}
                okText="提交并预览"
                cancelText="取消"
                onOk={() => this.handleOk()}
                confirmLoading={confirmLoading}
                onCancel={() => this.handleCancel()}
            >
                <Form>
                    <Form.Item
                        label="标题"
                        {...formItemLayout}>
                        <Input
                            style={{ width: 200 }}
                            type="user"
                            autoComplete="new-password"
                            prefix={<Icon type="crown" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入标题"
                            value={title}
                            onChange={e => this.setState({ title: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item 
                        label="显示位置" 
                        {...formItemLayout}>
                        <Select
                            style={{ width: 120 }}
                            value={source}
                            onChange={value => this.setState({ source: value })}>
                            <Select.Option key={0} value={0}>首页</Select.Option>
                            <Select.Option key={1} value={1}>游戏界面</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="显示顺序" 
                        {...formItemLayout}>
                        <Select
                            style={{ width: 120 }}
                            value={queue}
                            onChange={value => this.setState({ queue: value })}>
                            <Select.Option key={1} value={1}>第一个显示</Select.Option>
                            <Select.Option key={2} value={2}>第二个显示</Select.Option>
                            <Select.Option key={3} value={3}>第三个显示</Select.Option>
                            <Select.Option key={4} value={4}>第四个显示</Select.Option>
                            <Select.Option key={5} value={5}>第五个显示</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="操作类型" 
                        {...formItemLayout}>
                        <Checkbox checked={"" === type} onChange={e => this.handleTypeChange(e, "")}>无响应</Checkbox>
                        <Checkbox checked={"screen" === type} onChange={e => this.handleTypeChange(e, "screen")}>APP界面</Checkbox>
                        <Checkbox checked={"game" === type} onChange={e => this.handleTypeChange(e, "game")}>游戏详情</Checkbox>
                        <Checkbox checked={"url" === type} onChange={e => this.handleTypeChange(e, "url")}>外部网址</Checkbox>
                    </Form.Item>
                    {this.renderParamsForm()}
                    <Form.Item
                        label="轮播图网址" 
                        {...formItemLayout}>
                        <Input
                            style={{ width: 200 }}
                            type="user"
                            autoComplete="new-password"
                            prefix={<Icon type="folder-open" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入轮播图网址"
                            value={imageUrl}
                            onChange={e => this.setState({ imageUrl: e.target.value })} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="附加参数"
                        {...formItemLayout}>
                        <Input.TextArea
                            style={{ width: 200 }}
                            disabled={true}
                            type="textarea"
                            autoComplete="new-password"
                            placeholder="请输入附加参数"
                            value={this.combineParams()}
                            onChange={e => this.setState({ username: e.target.value })} 
                        />
                    </Form.Item>
                    {/* {this.renderUpload()} */}
                    <Form.Item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={`${Config.RES_PATH + imageUrl}`} alt="" height={200} width={400} />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    /**
     * 渲染轮播图
     */
    renderBannerItem (item) {
        let { id, title, imageurl } = item;
        return (
            <div key={id} style={{ width: 500, height: 250 }}>
                <img src={`${Config.RES_PATH + imageurl}`} alt={title} height={250} width={500} />
            </div>
        )
    }

    /**
     * 渲染走马灯效果
     */
    renderCarousel () {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ width: 500 }}>
                    <Carousel autoplay>
                        {this.state.systemBannerList.map(item => this.renderBannerItem(item))}
                    </Carousel>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        style={{ margin: 20 }}
                        type="primary" 
                        htmlType="submit"
                        onClick={() => this.intentToOperation({})}> 
                        创建轮播位
                    </Button>
                </div>
            </div>
        )
    }

    /**
     * 渲染轮播图表格
     */
    renderTable () {
        const columns = [{
            title: "预览图",
            dataIndex: 'imageurl',
            key: 'imageurl',
            width: "15%",
            render: (text, record) => (
                <img src={`${Config.RES_PATH + record['imageurl']}`} width="100%" />
            )
        },{
            title: "标题",
            dataIndex: 'title',
            key: 'title',
            width: "15%"
        },{
            title: "展示位置",
            dataIndex: 'source',
            key: 'source',
            width: "10%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${BANNER_SOURCE[record['source']]['title']}`}</p>
            )
        },{
            title: "顺序",
            dataIndex: 'queue',
            key: 'queue',
            width: "10%"
        },{
            title: "附加参数",
            dataIndex: 'params',
            key: 'params',
            width: "10%"
        },{
            title: "状态",
            dataIndex: 'status',
            key: 'status',
            width: "10%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${["已下线", "在线"][record['status']]}`}</p>
            )
        },{
            title: "维护时间",
            dataIndex: 'createTime',
            key: 'createTime',
            width: "15%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
            )
        },{
            title: '操作',
            key: 'action',
            width: "15%",
            render: (text, record) => (
              <span>
                <a onClick={() => this.intentToOperation(record)}>编辑</a>
                <Divider type="vertical" />
                <a onClick={() => this.onlineBanner(record['id'], record['status'] === 0 ? 1 : 0)}>{`${["上线", "下线"][record['status']]}`}</a>
              </span>
            ),
        }];
        return (
            <Table 
                columns={columns}
                loading={this.state.isLoading}
                dataSource={this.state.bannerList} 
                rowKey='id'
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                onChange={(page, pageSize) => this.systemBanner(page.current)}
            />
        )
    }

    renderBanner () {
        return (
            <div>
                {this.renderCarousel()}
                {this.renderTable()}
                {this.renderModal()}
            </div>
        )
    }

    render () {
        return (
            <div>
                <Card
                    style={{ width: '100%' }}
                    tabList={BANNER_SOURCE}
                    activeTabKey={this.state.tableKey}
                    onTabChange={(key) => { this.onTabChange(key, 'sourceTab'); }}
                    >
                    {this.renderBanner()}
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
})

export default connect(mapStateToProps, {}) (SystemBanner);