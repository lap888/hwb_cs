/*
 * @Author: fantao.meng 
 * @Date: 2019-02-19 23:13:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-26 14:28:58
 */

/*
 * @Author: fantao.meng 
 * @Date: 2019-02-19 23:13:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-25 14:34:09
 */

import { Table, Divider } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { STAR_LEVEL_DETAILS } from 'constantrisk';
import { Colors } from 'theme';
import { Send } from 'HttpPost';

class RiskStar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            starList: [],
            starCount: {},
            currentPage: 1,
            totalNumber: 1,
        }
    }

    componentDidMount() {
        this.fetchStarList(1);
    }

    /**
     * 获取星级达人列表
     */
    fetchStarList (page) {
        let { mobile, nickname, userId, status } = this.state;
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Risk.starList', { _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { count } = response['data'];
                that.setState({ starCount: count });
            }
        });
    }

    /**
     * 渲染星级达人列表
     */
    renderStarList () {
        const columns = [{
            title: "星级达人",
            dataIndex: 'name',
            key: 'name',
            width: "20%",
            render: (text, record) => (
                <p style={{ margin: 0, color: record['color'] }} >{text}</p>
            )
        },{
            title: "达人奖励",
            dataIndex: 'reward',
            key: 'reward',
            width: "25%"
        },{
            title: "达成要求",
            dataIndex: 'request',
            key: 'request',
            width: "25%"
        },{
            title: "达成人数",
            dataIndex: 'key',
            key: 'key',
            width: "15%",
            render: (text, record) => (
                <a style={{ margin: 0 }} onClick={() => this.props.router.push({ pathname: `/riskstaruserlist/${record['key']}` })}>{`${this.state.starCount.hasOwnProperty(`starLevel${text}`) ? this.state.starCount[`starLevel${text}`] : '--'}`}</a>
            )
        },{
            title: "操作",
            dataIndex: 'invalidCount',
            key: 'invalidCount',
            width: "15%",
            render: (text, record) => (
                <a style={{ margin: 0 }} onClick={() => this.props.router.push({ pathname: `/riskstaruserlist/${record['key']}` })}>详情</a>
            )
        }];
        return (
            <Table 
                columns={columns}
                loading={this.state.isLoading}
                dataSource={STAR_LEVEL_DETAILS} 
                rowKey='key'
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.starList.length }} 
                onChange={(page, pageSize) => this.fetchStarList(page.current)}
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {/* 星级达人列表 */}
                {this.renderStarList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(RiskStar);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};
