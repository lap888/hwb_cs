/*
 * @Author: fantao.meng 
 * @Date: 2019-04-02 17:07:16 
 * @Last Modified by: top
 * @Last Modified time: 2019-05-16 21:06:34
 */

import { Form, Input, Icon, Select, Button, message, DatePicker, Switch, Row, Col, AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { Send } from 'HttpPost';
import { Colors } from 'theme';
const { Option } = Select;

class AuctionCityCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rId: "",
            cId: "",
            uId: "",
            isShow: false,
            auctionEndTime: "",
            ownersEndTime: "",
            openAt: "",
            amount: "",
            realAmount: "",
            gem: "",
            type: 1,
            submitLoading: false,

            autoCityDataSource: [],
            autoOwnerDateSource: []
        }
    }
    
    componentWillMount() {
        let type = this.props.location.state.type;
        let data = this.props.location.state.data;
        console.log("===", data);
        if (type === 1) return;
        this.setState({
            type: type,
            cId: data.cityId,
            uId: data.id,
            auctionEndTime: moment(data.auctionEndTime).format('YYYY-MM-DD HH:mm:ss'),//data.auctionEndTime,
            ownersEndTime: moment(data.ownersEndTime).format('YYYY-MM-DD HH:mm:ss'),//data.ownersEndTime,
            openAt: moment(data.openAt).format('YYYY-MM-DD HH:mm:ss'),//data.openAt,
            amount: data.amount,
            realAmount: data.realAmount,
            gem: data.gem,
            rId: data.rId
        })
    }

    /**
     * 管理员角色选择
     */
    handleRoleChange(value) {
        this.setState({ role: value });
    }

    /**
     * 创建管理员
     */
    handleSubmit(type) {
        let { cId, rId, uId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, submitLoading } = this.state;

        // if (rId.trim() === '') {
        //     message.warn('城市rId为必填项');
        //     return;
        // }
        if (uId.trim() === '') {
            message.warn('城主ID为必填项');
            return;
        }
        if (openAt === '') {
            message.warn('城市开放时间为必填项');
            return;
        }
        if (auctionEndTime.trim() === '') {
            message.warn('竞拍结束时间为必填项');
            return;
        }
        if (ownersEndTime.trim() === '') {
            message.warn('城主到期时间为必填项');
            return;
        }
        if (amount === '') {
            message.warn('竞拍金额必填项');
            return;
        }
        if (realAmount === '') {
            message.warn('实际支付金额为必填项');
            return;
        }
        if (gem === '') {
            message.warn('钻石抵扣数量为必填项');
            return;
        }
        var that = this;
        if (!submitLoading) that.setState({ submitLoading: true });

        if (type == 1) {
            Send('CityAuction.addCityAuctionInfo', { cId, uId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, _uid: this.props.userId }, response => {
                if (that.state.submitLoading) that.setState({ submitLoading: false });
                if (response['success']) {
                    message.success("城主创建成功");
                    that.props.router.push({ pathname: `auctioncity` })
                } else {
                    message.error(response['errorMsg']);
                }
            });
        } else {
            //修改城市
            Send('CityAuction.updateAcutionInfo', { cId, uId, rId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, _uid: this.props.userId }, response => {
                if (that.state.submitLoading) that.setState({ submitLoading: false });
                if (response['success']) {
                    message.success("城主修改成功");
                } else {
                    message.error(response['errorMsg']);
                }
            });
        }
    }

    /**
     * 获取自动关联城市列表
     */
    fetchListCityList (value) {
        var that = this;
        Send('App.likeCityList', { searchText: value, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { list } = response['data'];
                that.setState({ autoCityDataSource: list });
            }
        });
    }

    /**
     * 获取自动关联城市列表
     */
    fetchListOwnerList (value) {
        var that = this;
        Send('App.likeOwnerList', { searchText: value, _uid: this.props.userId }, response => {
            if (response['success']) {
                let { list } = response['data'];
                that.setState({ autoOwnerDateSource: list });
            }
        });
    }

    /**
     * 清空CityID
     */
    onCityAutoChange (value) {
        if (isNaN(value) && !isNaN(this.state.cId)) this.setState({ cId: "" })
    }

    /**
     * 清空CityID
     */
    onOwnerAutoChange (value) {
        if (isNaN(value) && !isNaN(this.state.uId)) this.setState({ uId: "" })
    }

    /**
     * 城市名称自动补全
     */
    handleCityAutoSearch (value) {
        if (value.trim() !== '') this.fetchListCityList(value);
    }

    /**
     * 城主名称自动补全
     */
    handleOwnerAutoSearch (value) {
        if (value.trim() !== '' && value.length === 11) this.fetchListOwnerList(value);
    }

    /**
     * 关联城市ID
     */
    handleCityAutoSelect(value) {
        this.setState({ cId: value });
    }

    /**
     * 关联城主ID
     */
    handleOwnerAutoSelect(value) {
        this.setState({ uId: value });
    }

    render() {
        const formItemLayout = {
            labelCol: {
                md: { span: 8 },
            },
            wrapperCol: {
                md: { span: 8 },
            },
        };
        let { cId, uId, isShow, auctionEndTime, ownersEndTime, openAt, amount, realAmount, gem, submitLoading, autoCityDataSource, autoOwnerDateSource } = this.state;
        const dateFormat = 'YYYY-MM-DD';
        let type = this.props.location.state.type;
        return (
            <div style={{ padding: 40, height: '100%', background: Colors.C8 }}>
                <Form>
                    <Row gutter={24}>
                        <Col span={8} style={{ display: "block" }}>
                            <Form.Item
                                label="城市名称"
                                {...formItemLayout}
                            >
                                <AutoComplete
                                    style={{ width: 200 }}
                                    dataSource={autoCityDataSource}
                                    onChange={value => this.onCityAutoChange(value)}
                                    onSelect={value => this.handleCityAutoSelect(value)}
                                    onSearch={value => this.handleCityAutoSearch(value)}
                                    placeholder="请输入城市名称"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: "block" }}>
                            <Form.Item
                                label="城主联系方式"
                                {...formItemLayout}
                            >
                                <AutoComplete
                                    style={{ width: 200 }}
                                    dataSource={autoOwnerDateSource}
                                    //onChange={value => this.onOwnerAutoChange(value)}
                                    onSelect={value => this.handleOwnerAutoSelect(value)}
                                    onSearch={value => this.handleOwnerAutoSearch(value)}
                                    placeholder="请输入城主名称"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: "block" }}>
                            <Form.Item
                                label="开始竞拍时间"
                                {...formItemLayout}
                            >
                                {/* <DatePicker style={{ width: 200 }} format={dateFormat} defaultValue={openAt ? moment(openAt, dateFormat) : ""} placeholder="开始竞拍时间" onChange={(value, dateString) => this.setState({ openAt: moment(new Date(dateString)).format("YYYY-MM-DD HH:mm:ss") })} /> */}
                                <DatePicker style={{ width: 200 }} format={dateFormat} {...type === 2 ? { defaultValue: moment(openAt, dateFormat) } : {}} placeholder="开始竞拍时间" onChange={(value, dateString) => this.setState({ openAt: moment(new Date(dateString)).format("YYYY-MM-DD HH:mm:ss") })} />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: "block" }}>
                            <Form.Item
                                label="竞拍结束时间"
                                {...formItemLayout}
                            >
                                {/* <DatePicker style={{ width: 200 }} format={dateFormat} defaultValue={auctionEndTime ? moment(auctionEndTime, dateFormat) : ""} placeholder="竞拍结束时间" onChange={(value, dateString) => this.setState({ auctionEndTime: moment(new Date(dateString)).format("YYYY-MM-DD HH:mm:ss") })} /> */}
                                <DatePicker style={{ width: 200 }} format={dateFormat} {...type === 2 ? { defaultValue: moment(auctionEndTime, dateFormat) } : {}}  placeholder="竞拍结束时间" onChange={(value, dateString) => this.setState({ auctionEndTime: moment(new Date(dateString)).format("YYYY-MM-DD HH:mm:ss") })} />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: "block" }}>
                            <Form.Item
                                label="城主到期时间"
                                {...formItemLayout}
                            >
                                {/* <DatePicker style={{ width: 200 }} format={dateFormat} defaultValue={ownersEndTime ? moment(ownersEndTime, dateFormat) : ""} placeholder="城主到期时间" onChange={(value, dateString) => this.setState({ ownersEndTime: moment(new Date(dateString)).format("YYYY-MM-DD HH:mm:ss") })} /> */}
                                <DatePicker style={{ width: 200 }} format={dateFormat} {...type === 2 ? { defaultValue: moment(ownersEndTime, dateFormat) } : {}} placeholder="城主到期时间" onChange={(value, dateString) => this.setState({ ownersEndTime: moment(new Date(dateString)).format("YYYY-MM-DD HH:mm:ss") })} />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: "block" }}>
                            <Form.Item
                                label="竞拍金额"
                                {...formItemLayout}
                            >
                                <Input
                                    type="phone"
                                    autoComplete="new-password"
                                    style={{ width: 200 }}
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入竞拍金额"
                                    value={amount}
                                    onChange={e => this.setState({ amount: e.target.value })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: "block" }}>
                            <Form.Item
                                label="实际支付金额"
                                {...formItemLayout}
                            >
                                <Input
                                    type="phone"
                                    autoComplete="new-password"
                                    style={{ width: 200 }}
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入实际支付金额"
                                    value={realAmount}
                                    onChange={e => this.setState({ realAmount: e.target.value })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: "block" }}>
                            <Form.Item
                                label="抵扣钻石数量"
                                {...formItemLayout}
                            >
                                <Input
                                    type="phone"
                                    autoComplete="new-password"
                                    style={{ width: 200 }}
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入抵扣钻石数量"
                                    value={gem}
                                    onChange={e => this.setState({ gem: e.target.value })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: "block" }}>
                            <Form.Item
                                label="是否展示"
                                {...formItemLayout}
                            >
                                <Switch checked={isShow} onChange={isShow => this.setState({ isShow })} />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
                <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
                    {this.state.type == 1 ?
                        <Button style={{ width: "150px" }} loading={submitLoading} type="primary" htmlType="submit"
                            onClick={this.handleSubmit.bind(this, 1)}
                        >创建城主</Button> :
                        <Button style={{ width: "150px" }} loading={submitLoading} type="danger" htmlType="submit"
                            onClick={this.handleSubmit.bind(this, 2)}
                        >修改城主</Button>}

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId,
});

export default connect(mapStateToProps, {})(AuctionCityCreate);