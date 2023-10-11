/*
 * @Author: fantao.meng 
 * @Date: 2019-02-19 23:13:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-29 16:19:32
 */

import { Table, Divider } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { MINING_TYPE_LIST } from 'constantclient';
import { MINING_SOURCE_LIST } from 'constantrisk';
import { Colors } from 'theme';
import { Send } from 'HttpPost';

class RiskMiningUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            miningUserList: [],
            currentPage: 1,
            totalNumber: 1,
        }
    }

    componentDidMount() {
        this.fetchMiningUserList(1);
    }

    /**
     * 获取用户列表
     */
    fetchMiningUserList (page) {
        var that = this;
        let { miningId, status } = this.props.params;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Risk.miningUserList', { miningId, status, page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, clientList: list, totalNumber });
            }
        });
    }

    /**
     * 渲染用户列表
     */
    renderMiningUserList () {
        const columns = [{
            title: "用户名",
            dataIndex: 'nickName',
            key: 'nickName',
            width: "150px",
            fixed: 'left',
            render: (text, record) => (
                <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['userId']}` })}>{text}</a>
            ),
        },{
            title: "用户ID",
            dataIndex: 'userId',
            key: 'userId',
            width: "150px",
        },{
            title: "手机号",
            dataIndex: 'mobile',
            key: 'mobile',
            width: "150px",
        },{
            title: "城市",
            dataIndex: 'cityName',
            key: 'cityName',
            width: "150px",
        },{
            title: "钻石余额",
            dataIndex: 'gemNumber',
            key: 'gemNumber',
            width: "150px"
        },{
            title: "矿机名称",
            dataIndex: 'minning_id',
            key: 'minning_id',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0, color: MINING_TYPE_LIST[text]['color'] }}>{`${MINING_TYPE_LIST[text]['minning_name']}`}</p>
            )
        },{
            title: "矿机来源",
            dataIndex: 'source',
            key: 'source',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${MINING_SOURCE_LIST[text]['value']}`}</p>
            )
        },{
            title: "购买时间",
            dataIndex: 'createTime',
            key: 'createTime',
            width: "220px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(record['createTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
            )
        },{
            title: "到期时间",
            dataIndex: 'endTime',
            key: 'endTime',
            width: "220px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(record['endTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
            )
        },{
            title: '操作',
            key: 'action',
            width: "150px",
            fixed: 'right',
            render: (text, record) => (
              <span>
                <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['userId']}` })}>详情</a>
                <Divider type="vertical" />
              </span>
            ),
        }];
        return (
            <Table 
                columns={columns}
                loading={this.state.isLoading}
                dataSource={this.state.clientList} 
                rowKey='id'
                scroll={{ x: "1680px" }} 
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                onChange={(page, pageSize) => this.fetchMiningUserList(page.current)}
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {/* 用户列表 */}
                {this.renderMiningUserList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(RiskMiningUserList);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};
