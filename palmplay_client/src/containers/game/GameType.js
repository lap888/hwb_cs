/*
 * @Author: fantao.meng 
 * @Date: 2019-02-21 23:08:22 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-05 10:02:12
 */

import { Form, Icon, Input, Button, Select, Table, Divider, Tag, Modal } from 'antd';
import { connect } from 'react-redux';
import { Colors } from 'theme';
import { Send } from 'HttpPost';

class GameType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            categoryList: [],
            pageSize: 5,            //页大小
            currentPage: 1,         //当前页
            totalNumber: 8,         //总条数
            
            actionModalVisible: false,
            actionLoading: false,   // 用户操作状态
            name: '',
            id: '',                 //选择id
            addOrUpdate: -1,        //新增1 or修改2 标识
        }
    }

    componentDidMount() {
        //获取游戏分类
        this.fetchGameCategoryList(1);
    }

    //加载/刷新数据
    fetchGameCategoryList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Game.getGameCategories', { page: page || 1, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, categoryList: list, totalNumber });
            }
        });
    }

    //删除数据
    delData = (record) => {
        Send('Game.delGameCategorie', { id: record.id, _uid: this.props.userId }, (result) => {
            if (result.success) {
                this.fetchGameCategoryList();
            }
        });
    }

    /**
     * 弹出、收起用户操作框
     * @param {删除或新增标识} addOrUpdate
     * @param {*} flag 
     */
    confirmClientAction(flag) {
        //console.log('弹出、收起用户操作框' + this.state.addOrUpdate);
        if (this.state.addOrUpdate === 1) {//新增
            this.setState({ actionLoading: true }, () => {
                let data = { name: this.state.name, _uid: this.props.userId }
                Send('Game.addGameCategorie', data, (result) => {
                    if (result.success) {
                        this.setState({ actionLoading: false, actionModalVisible: false });
                        this.fetchGameCategoryList();
                    }
                });
            });
        } else if (this.state.addOrUpdate === 2) {//修改
            if (!flag) {
                this.setState({ actionModalVisible: false }, () => {
                    this.setState({ name: '' });
                });
                return;
            }
            this.setState({ actionLoading: true }, () => {
                // name,id
                let data = { name: this.state.name, id: this.state.id, _uid: this.props.userId }                
                Send('Game.updateGameCategorie', data, (result) => {
                    if (result.success) {
                        this.setState({ actionLoading: false, actionModalVisible: false });
                        this.fetchGameCategoryList();
                    }
                });
            });
        }
    }

    /**
     * 打开用户信息弹出框
     */
    openClientActionModal(record) {
        //赋值变化
        let { name, id } = record;
        this.setState({ name, id }, () => {            
            this.setState({ actionModalVisible: true, name: record.name });
        });
    }

    /**
     * 渲染搜索框
     */
    renderSearchBar() {
        return (
            <div style={{ display: 'flex', margin: '20px', borderWidth: 1, borderRadius: 4, borderColor: 'rgba(0, 0, 0, 0.15)', borderStyle: 'solid' }}>
                <Form style={{ padding: '30px 40px 30px 40px' }} layout="inline">
                    <Form.Item>
                        <Button type="primary" htmlType="button" onClick={() => {
                            //this.confirmClientAction(1, true);
                            this.setState({ addOrUpdate: 1 }, () => {
                                this.openClientActionModal({});
                            });
                        }}> 新建游戏类别</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    /**
     * 渲染用户操作Modal
     */
    renderClientActionModal() {
        let { actionLoading, actionModalVisible, name } = this.state;        
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
        return (
            <Modal
                visible={actionModalVisible}
                title="游戏分类操作框"
                onOk={() => this.confirmClientAction(true)}
                onCancel={() => this.confirmClientAction(false)}
                footer={[
                    <Button key="back" onClick={() => this.confirmClientAction(false)}>再想想...</Button>,
                    <Button key="submit" type="primary" loading={actionLoading} onClick={() => this.confirmClientAction(true)}>确定</Button>,
                ]}>
                <div style={{ display: 'flex', flex: 1 }}>
                    <Form style={{ padding: '10px 10px 10px 10px' }} layout="vertical">
                        <Form.Item
                            style={Styles.actionFormItem}
                            label={<p style={Styles.label}>游戏类别</p>}
                            {...formItemLayout}>
                            <Input autoComplete="new-password" defaultValue={name} value={name} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={event => {
                                this.setState({ name: event.target.value }, () => {
                                    //console.log('input 数据发生变化' + this.state.name);
                                })
                            }} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        )
    }

    /**
     * 渲染游戏分类列表
     */
    renderGameTypeList() {
        const columns = [{
            title: "类型",
            dataIndex: 'name',
            key: 'name',
            width: "20%",
        },{
            title: "已上线游戏量",
            dataIndex: 'onlineGameCount',
            key: 'onlineGameCount',
            width: "20%",
            render: (text, record) => (
                <a onClick={() => {}}>{text}</a>
            ),
        },{
            title: "未上线游戏量",
            dataIndex: 'offlineGameCount',
            key: 'offlineGameCount',
            width: "20%",
            render: (text, record) => (
                <a onClick={() => {}}>{text}</a>
            ),
        },{
            title: "创建时间",
            dataIndex: 'created_at',
            key: 'created_at',
            width: "20%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{moment(text).format('YYYY年MM月DD日 HH时mm分')}</p>
            )
        },{
            title: '操作',
            key: 'id',
            dataIndex: 'id',
            width: "20%",
            render: (text, record) => (
                <span>
                    <a href="javascript:;">详情</a>
                    <Divider type="vertical" />
                    <a onClick={() => {
                        this.setState({ addOrUpdate: 2 }, () => {
                            this.openClientActionModal(record)
                        })
                    }}>修改</a>
                    <Divider type="vertical" />
                    <a onClick={() => {
                        let r = confirm('你确定要删除吗');
                        if (r) {
                            this.delData(record);
                        }
                    }}>删除</a>
                </span>
            ),
        }];
        return (
            <Table 
                columns={columns} 
                loading={this.state.isLoading}
                dataSource={this.state.categoryList} 
                rowKey="id" 
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                onChange={(page, pageSize) => this.fetchGameCategoryList(page.current)}
            />
        )
    }

    render() {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {/* 搜索框 */}
                {this.renderSearchBar()}
                {/* 游戏内容 */}
                {this.renderGameTypeList()}
                {/* 操作框 */}
                {this.renderClientActionModal()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(GameType);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 300 },
    label: { fontSize: 14, color: Colors.C1 },
};
