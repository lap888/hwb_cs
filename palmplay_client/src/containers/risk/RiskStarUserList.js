/*
 * @Author: fantao.meng 
 * @Date: 2019-02-19 23:13:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-29 16:23:17
 */

import { Table, Divider } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { STAR_LEVEL_DETAILS } from 'constantrisk';
import { Colors } from 'theme';
import { Send } from 'HttpPost';

class RiskStarUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            starUserList: [],
            currentPage: 1,
            totalNumber: 1,
        }
    }

    componentDidMount() {
        this.fetchStarUserList(1);
    }

    /**
     * 获取用户列表
     */
    fetchStarUserList (page) {
        var that = this;
        let { level } = this.props.params;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Risk.starUserList', { level, page, _uid: this.props.userId }, response => {
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
    renderStarUserList () {
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
            title: "星级达人",
            dataIndex: 'starLevel',
            key: 'starLevel',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0, color: STAR_LEVEL_DETAILS[text]['color'] }}>{`${STAR_LEVEL_DETAILS[text]['name']}`}</p>
            )
        },{
            title: "团队人数",
            dataIndex: 'teamCount',
            key: 'teamCount',
            width: "150px"
        },{
            title: "直推人数",
            dataIndex: 'pushCount',
            key: 'pushCount',
            width: "150px"
        },{
            title: "直推实名人数",
            dataIndex: 'pushAuthCount',
            key: 'pushAuthCount',
            width: "150px"
        },{
            title: "团队活跃度",
            dataIndex: 'teamActivity',
            key: 'teamActivity',
            width: "150px"
        },{
            title: "大区活跃度",
            dataIndex: 'teamBigActivity',
            key: 'teamBigActivity',
            width: "150px"
        },{
            title: "小区活跃度",
            dataIndex: 'teamSmallActivity',
            key: 'teamSmallActivity',
            width: "150px"
        },{
            title: "更新时间",
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: "220px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(record['updateTime']).format('YYYY年MM月DD日 HH时mm分')}`}</p>
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
                scroll={{ x: "2020px" }}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }} 
                onChange={(page, pageSize) => this.fetchStarUserList(page.current)}
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {/* 用户列表 */}
                {this.renderStarUserList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(RiskStarUserList);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};
