/*
 * @Author: fantao.meng 
 * @Date: 2019-05-11 11:31:08 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-16 18:12:26
 */

import { Table, Divider, Button } from 'antd';
import { connect } from 'react-redux';
import { Send } from 'HttpPost';

class AuctionCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            auctionCityList: [],
            currentPage: 1,
            totalNumber: 1,
        }
    }

    componentDidMount() {
        this.fetchActionCityList(1);
    }

    /**
     * 获取城市大厅列表
     */
    fetchActionCityList(page) {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('CityAuction.findCityOwners', { page, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list, totalNumber } = response['data'];
                that.setState({ currentPage: page, auctionCityList: list, totalNumber });
            }
        });
    }

    /**
     * 渲染添加管理员
     */
    renderCreateAuctionity() {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    style={{ margin: 20 }}
                    type="primary"
                    htmlType="submit"
                    onClick={() => this.props.router.push({ pathname: `/auctioncitycreate`, state: { type: 1, data: {} } })}>
                    创建城主
                </Button>
            </div>
        )
    }

    /**
     * 渲染城市大厅列表
     */
    renderGameSupplierList() {
        const columns = [{
            title: "城市名称",
            dataIndex: 'cityName',
            key: 'cityName',
            width: "150px",
            fixed: 'left'
        }, {
            title: "城主姓名",
            dataIndex: 'name',
            key: 'name',
            width: "150px",
            render: (text, record) => (
                <a onClick={() => this.props.router.push({ pathname: `/clientinfo/${record['id']}` })}>{text}</a>
            ),
        }, {
            title: "竞拍价格",
            dataIndex: 'amount',
            key: 'amount',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`¥${text}`}</p>
            ),
        }, {
            title: "实际支付",
            dataIndex: 'realAmount',
            key: 'realAmount',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`¥${text}`}</p>
            ),
        }, {
            title: "抵扣钻石数量",
            dataIndex: 'gem',
            key: 'gem',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${text}枚`}</p>
            ),
        }, {
            title: "开始竞拍时间",
            dataIndex: 'openAt',
            key: 'openAt',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(text).format('YYYY年MM月DD日')}`}</p>
            ),
        }, {
            title: "竞拍结束时间",
            dataIndex: 'auctionEndTime',
            key: 'auctionEndTime',
            width: "150px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${moment(text).format('YYYY年MM月DD日')}`}</p>
            )
        }, {
            title: "城主有效期",
            dataIndex: 'ownersEndTime',
            key: 'ownersEndTime',
            width: "300px",
            render: (text, record) => (
                <p style={{ margin: 0 }}>{`${new Date(record['auctionEndTime']) < new Date() ? (moment(record['auctionEndTime']).format('YYYY年MM月DD日') + " 至 " + moment(text).format('YYYY年MM月DD日')) : "--"}`}</p>
            )
        }, {
            title: '操作',
            key: 'action',
            width: "150px",
            fixed: 'right',
            render: (text, record) => (
                <span>
                    <a onClick={() => this.props.router.push({ pathname: `/auctioncityinfo/${record['id']}` })}>详情</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.props.router.push({ pathname: `/auctioncitycreate`, state: { type: 2, data: record } })}>编辑</a>
                    <Divider type="vertical" />
                </span>
            ),
        }];
        return (
            <Table
                columns={columns}
                loading={this.state.isLoading}
                dataSource={this.state.auctionCityList}
                rowKey='cityId'
                scroll={{ x: "1500px" }}
                pagination={{ position: 'bottom', current: this.state.currentPage, total: this.state.totalNumber }}
                onChange={(page, pageSize) => this.fetchActionCityList(page.current)}
            />
        )
    }

    render() {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                {this.renderCreateAuctionity()}
                {/* 城市大厅列表 */}
                {this.renderGameSupplierList()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(AuctionCity);


