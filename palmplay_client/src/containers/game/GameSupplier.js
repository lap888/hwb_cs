/*
 * @Author: fantao.meng 
 * @Date: 2019-04-27 13:30:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-02 20:29:36
 */

import { Table, Divider } from 'antd';
import { connect } from 'react-redux';
import { Send } from 'HttpPost';

class AddGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            gameSupplierList: [],
            currentPage: 1,
            totalNumber: 1,
        }
    }

    componentDidMount() {
        this.fetchGameSupplierList(1);
    }

    /**
     * 获取供应商列表
     */
    fetchGameSupplierList (page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Game.supplierList', { page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, gameSupplierList: list, totalNumber });
            }
        });
    }

    /**
     * 渲染供应商列表
     */
    renderGameSupplierList () {
        const columns = [{
            title: "供应商名",
            dataIndex: 'supplierName',
            key: 'supplierName',
            width: "25%",
        },{
            title: "是否可用",
            dataIndex: 'isEnable',
            key: 'isEnable',
            width: "15%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{text === 1 ? "可用" : "不可用"}</p>
            )
        },{
            title: "已上线游戏量",
            dataIndex: 'onlineGameCount',
            key: 'onlineGameCount',
            width: "15%",
            render: (text, record) => (
                <a onClick={() => {}}>{text}</a>
            ),
        },{
            title: "未上线游戏量",
            dataIndex: 'offlineGameCount',
            key: 'offlineGameCount',
            width: "15%",
            render: (text, record) => (
                <a onClick={() => {}}>{text}</a>
            ),
        },{
            title: "创建时间",
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
                    <a onClick={() => {}}>详情</a>
                    <Divider type="vertical" />
                </span>
            ),
        }];
        return (
            <Table 
                columns={columns}
                loading={this.state.isLoading}
                dataSource={this.state.gameSupplierList} 
                rowKey='supplierId'
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                onChange={(page, pageSize) => this.fetchGameSupplierList(page.current)}
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {/* 供应商列表 */}
                {this.renderGameSupplierList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(AddGame);


