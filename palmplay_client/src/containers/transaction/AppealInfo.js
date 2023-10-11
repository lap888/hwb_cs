/*
 * @Author: fantao.meng 
 * @Date: 2019-05-03 14:23:32 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-11 23:42:28
 */

import { Timeline, Modal, Button, Select, message, Spin } from 'antd';
import { connect } from 'react-redux';
import { Send } from 'HttpPost';
import { TRANSACTION_PROGRESS, APPEAL_STATUS, APPEAL_RESULT } from 'constanttrade';
import Config from 'config';

class AppealInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            previewVisible: false,
            previewUrl: "",
            submitStatus: "",
            // 时间轴参数
            entryOrderTime: null,
            dealTime: null,
            paidTime: null,
            appealTime: null,
            payCoinTime: null,
            // 买家信息
            buyerAlipay: "",
            buyerMobile: "",
            buyerName: "",
            buyerRealName: "",
            buyerUid: "",
            // 卖家信息
            sellerAlipay: "",
            sellerMobile: "",
            sellerName: "",
            sellerRealName: "",
            seller_uid: "",
            // 订单信息
            tradeNumber: "",
            amount: "",
            price: "",
            totalPrice: "",
            tradePicture: "",
            fee: "",
            // 申诉信息
            appealPicture: "",
            appealResult: "",
            description: "",
            status: "",
            createTime: "",
            updateTime: ""
        }
    }

    componentDidMount () {
        this.fetchAppealInfo();
    }

    /**
     * 获取申诉信息
     */
    fetchAppealInfo () {
        var that = this;
        if (!that.state.isLoading) that.setState({ isLoading: true });
        Send('Trade.appealInfo', { appealId: this.props.params.appealId, _uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { entryOrderTime, dealTime, paidTime, appealTime, buyerAlipay, buyerMobile, buyerName, buyerRealName, buyerUid, sellerAlipay, sellerMobile, sellerName, sellerRealName, seller_uid, appealResult, description, status, appealPicture, createTime, updateTime, tradeNumber, amount, price, totalPrice, tradePicture, fee } = response['data']['orderInfo'];
                that.setState({ entryOrderTime, dealTime, paidTime, appealTime, buyerAlipay, buyerMobile, buyerName, buyerRealName, buyerUid, sellerAlipay, sellerMobile, sellerName, sellerRealName, seller_uid, appealResult, description, status, appealPicture, createTime, updateTime, tradeNumber, amount, price, totalPrice, tradePicture, fee });
            }
        });
    }

    /**
     * 提交申诉结果
     */
    submitAppeal () {
        var that = this;
        Send('Trade.submitAppeal', { appealId: this.props.params.appealId, submitStatus: this.state.submitStatus, _uid: this.props.userId }, response => {
            if (response['success']) {
                this.fetchAppealInfo();
            }
        });
    }

    /**
     * 审核提交确认对话框
     */
    confirmModal () {
        if (this.state.submitStatus === "") {
            message.warn("申诉结果为必选项");
            return;
        }
        Modal.confirm({
            title: `确定要${APPEAL_RESULT[this.state.submitStatus]['value']}当前交易申诉?`,
            content: '三思而后行',
            onOk: () => this.submitAppeal(),
            onCancel() {},
        });
    }

    /**
     * 预览图片
     */
    onClickPicture (url) {
        this.setState({ previewUrl: url }, () => {
            this.setState({ previewVisible: true });
        })
    }

    /**
     * 获取申诉状态
     */
    getAppealStatus(item) {
        let { status, appealResult } = item;
        if (status === 0) return "待处理";
        if (appealResult === 0) return "驳回";
        if (appealResult === 1) return "同意";
        // 兼容垃圾数据
        return "";
    }

    /**
     * 时间轴参数
     */
    timeLineText (item) {
        let { entryOrderTime, dealTime, paidTime, appealTime, buyerAlipay, buyerMobile, buyerName, buyerRealName, buyerUid, sellerAlipay, sellerMobile, sellerName, sellerRealName, seller_uid, description, status, appealResult, appealPicture, createTime, updateTime, tradeNumber, amount, price, totalPrice, tradePicture, fee } = this.state;
        switch (item['key']) {
            case "entryOrderTime":
                return (
                    <div>
                        <p>{`${item['value'] + " " + (this.state[item['key']] ? moment(this.state[item['key']]).format('YYYY-MM-DD HH:mm') : "")}`}</p>
                        <p style={Styles.p}>买家信息</p>
                        <p style={Styles.p}>{`实名 ${buyerRealName}`}</p>
                        <p style={Styles.p}>{`支付宝 ${buyerAlipay}`}</p>
                        <p style={Styles.p}>{`手机号 ${buyerMobile}`}</p>
                        <p style={Styles.p}>{`昵称 ${buyerName}`}</p>
                    </div>
                )
            case "dealTime":
                return (
                    <div>
                        <p>{`${item['value'] + " " + (this.state[item['key']] ? moment(this.state[item['key']]).format('YYYY-MM-DD HH:mm') : "")}`}</p>
                        <p style={Styles.p}>卖家信息</p>
                        <p style={Styles.p}>{`实名 ${sellerRealName}`}</p>
                        <p style={Styles.p}>{`支付宝 ${sellerAlipay}`}</p>
                        <p style={Styles.p}>{`手机号 ${sellerMobile}`}</p>
                        <p style={Styles.p}>{`昵称 ${sellerName}`}</p>
                    </div>
                )
            case "paidTime":
                return (
                    <div>
                        <p>{`${item['value'] + " " + (this.state[item['key']] ? moment(this.state[item['key']]).format('YYYY-MM-DD HH:mm') : "")}`}</p>
                        <p style={Styles.p}>订单信息</p>
                        <p style={Styles.p}>{`订单号 ${tradeNumber}`}</p>
                        <p style={Styles.p}>{`单价 $${price}`}</p>
                        <p style={Styles.p}>{`数量 ${amount}`}</p>
                        <p style={Styles.p}>{`总价 ¥${totalPrice}`}</p>
                        <p style={Styles.p}>{`手续费 ${fee}枚`}</p>
                    </div>
                )
            case "createTime":
                return (
                    <div>
                        <p>{`${item['value'] + " " + (this.state[item['key']] ? moment(this.state[item['key']]).format('YYYY-MM-DD HH:mm') : "")}`}</p>
                        <p style={Styles.p}>申诉描述</p>
                        <p style={Styles.p}>{`${description}`}</p>
                    </div>
                )
            case "updateTime":
                return (
                    <div>
                        <p>{`${item['value'] + " " + (this.state.status !== 0 && this.state[item['key']] ? moment(this.state[item['key']]).format('YYYY-MM-DD HH:mm') : "")}`}</p>
                        <p style={Styles.p}>{`处理状态 ${this.getAppealStatus({status, appealResult})}`}</p>
                    </div>
                )
            default:
                return <p>{`${item['value'] + " " + (this.state[item['key']] ? moment(this.state[item['key']]).format('YYYY-MM-DD HH:mm') : "")}`}</p>
        }
    }

    /**
     * 渲染时间轴
     */
    renderTimeline () {
        return (
            <Timeline mode="alternate" style={{ flex: 1 }}>
                {TRANSACTION_PROGRESS.map(item => 
                    <Timeline.Item key={item['key']}>{this.timeLineText(item)}</Timeline.Item>
                )}
            </Timeline>
        )
    }

    /**
     * 渲染交易、申诉图片
     */
    renderPicture () {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 1 }}>
                        <Button type="primary" onClick={() => this.onClickPicture(this.state.tradePicture)}>交易支付截图</Button>
                        <img style={{ marginTop: 20, width: "70%" }} src={this.state.tradePicture} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Button type="primary" onClick={() => this.onClickPicture(this.state.appealPicture)}>交易申诉截图</Button>
                        <img style={{ marginTop: 20, width: "70%" }} src={this.state.appealPicture} />
                    </div>
                </div>
                {this.state.status === 0 &&
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'flex-end', marginBottom: 60 }}>
                        <div style={{ display: 'flex' }}>
                            <Select value={this.state.submitStatus} style={{ width: 180 }} onChange={value => this.setState({ submitStatus: value })}>
                                {APPEAL_RESULT.map(item => <Select.Option key={item['key']} value={item['key']}>{item['value']}</Select.Option>)}
                            </Select>
                            <Button type="primary" style={{ marginLeft: 20 }} onClick={() => this.confirmModal()}>提交</Button>
                        </div>
                    </div>
                }
            </div>
        )
    }

    /**
     * 渲染图片预览Modal
     */
    renderPreview () {
        return (
            <Modal
                title=""
                visible={this.state.previewVisible}
                centered
                footer={null}
                closable={false}
                destroyOnClose
                maskClosable
                bodyStyle={{ backgroundColor: "transparent"}}
                onCancel={() => this.setState({ previewVisible: false })}
            >
                <img style={{ height: "100%", width: "100%" }} src={this.state.previewUrl} />
            </Modal>
        )
    }

    render () {
        return (
            <Spin spinning={this.state.isLoading}>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', background: '#FFFFFF', padding: '20px' }}>
                    {this.renderTimeline()}
                    {this.renderPicture()}
                    {this.renderPreview()}
                </div>
            </Spin>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(AppealInfo);

const Styles = {
    p: { margin: 2 },
}
