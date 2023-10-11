/*
 * @Author: fantao.meng 
 * @Date: 2019-02-19 23:13:13 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-26 15:50:11
 */

import { Table, Divider } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { MINING_TYPE_LIST } from 'constantclient';
import { Colors } from 'theme';
import { Send } from 'HttpPost';

class RiskMining extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            miningList: [],
            miningCount: {},
            currentPage: 1,
            totalNumber: 1,
        }
    }

    componentDidMount() {
        this.sortMiningList();
        this.fetchMiningList(1);
    }

    /**
     * 矿机排序
     */
    sortMiningList () {
        let miningTypeList = [...MINING_TYPE_LIST];
        this.setState({ miningList: miningTypeList.sort((a, b) => a['gem_in'] - b['gem_in']) })
    }

    /**
     * 获取矿机列表
     */
    fetchMiningList (page) {
        let { mobile, nickname, userId, status } = this.state;
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Risk.miningList', { _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { count } = response['data'];
                that.setState({ miningCount: count });
            }
        });
    }

    /**
     * 渲染矿机列表
     */
    renderMiningList () {
        const columns = [{
            title: "矿机名",
            dataIndex: 'minning_name',
            key: 'minning_name',
            width: "12.5%",
            render: (text, record) => (
                <p style={{ margin: 0, color: record['color'] }}>{`${record['minning_name']}`}</p>
            )
        },{
            title: "矿机ID",
            dataIndex: 'minning_id',
            key: 'minning_id',
            width: "12.5%"
        },{
            title: "兑换消耗",
            dataIndex: 'gem_in',
            key: 'gem_in',
            width: "12.5%"
        },{
            title: "钻石产量",
            dataIndex: 'gem_out',
            key: 'gem_out',
            width: "12.5%"
        },{
            title: "运行时长",
            dataIndex: 'minning_time',
            key: 'minning_time',
            width: "12.5%",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${record['minning_time']}/天`}</p>
            )
        },{
            title: "基础活跃度",
            dataIndex: 'activity_level',
            key: 'activity_level',
            width: "12.5%"
        },{
            title: "有效持有量",
            dataIndex: 'effectiveCount',
            key: 'effectiveCount',
            width: "12.5%",
            render: (text, record) => (
                <a style={{ margin: 0 }} onClick={() => this.props.router.push({ pathname: `/riskmininguserList/${record['minning_id']}/${1}` })}>{`${this.state.miningCount.hasOwnProperty("effectiveCount" + record["minning_id"]) ? this.state.miningCount["effectiveCount" + record["minning_id"]] : "--"}台`}</a>
            )
        },{
            title: "过期持有量",
            dataIndex: 'invalidCount',
            key: 'invalidCount',
            width: "12.5%",
            render: (text, record) => (
                <a style={{ margin: 0 }} onClick={() => this.props.router.push({ pathname: `/riskmininguserList/${record['minning_id']}/${0}` })}>{`${this.state.miningCount.hasOwnProperty("invalidCount" + record["minning_id"]) ? this.state.miningCount["invalidCount" + record["minning_id"]] : "--"}台`}</a>
            )
        }];
        return (
            <Table 
                columns={columns}
                loading={this.state.isLoading}
                dataSource={this.state.miningList} 
                rowKey='minning_id'
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.miningList.length }} 
                onChange={(page, pageSize) => this.fetchMiningList(page.current)}
            />
        )
    }

    render () {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {/* 矿机列表 */}
                {this.renderMiningList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(RiskMining);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};
