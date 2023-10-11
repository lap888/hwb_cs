/*
 * @Author: fantao.meng 
 * @Date: 2019-04-29 14:15:36 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-04-29 15:34:10
 */

import { Table, Divider } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { STAR_LEVEL_DETAILS } from 'constantrisk';
import { Colors } from 'theme';
import { Send } from 'HttpPost';

class RiskLocation extends React.Component {
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
        Send('Risk.cityList', { page, _uid: this.props.userId }, response => {
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
            title: "省份",
            dataIndex: 'province',
            key: 'province',
            width: "25%",
        },{
            title: "城市名称",
            dataIndex: 'city',
            key: 'city',
            width: "25%",
        },{
            title: "城市用户量",
            dataIndex: 'clientAccount',
            key: 'clientAccount',
            width: "25%",
            render: (text, record) => (
                <a onClick={() => {}}>{text}</a>
            ),
        },{
            title: '操作',
            key: 'cityCode',
            width: "25%",
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
                dataSource={this.state.clientList} 
                rowKey='id'
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

export default connect(mapStateToProps, {})(RiskLocation);

const Styles = {
    formItem: { width: 180 },
    actionFormItem: { width: 260 },
    label: { fontSize: 14, color: Colors.C1 },
};
