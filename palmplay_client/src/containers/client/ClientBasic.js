/*
 * @Author: fantao.meng 
 * @Date: 2019-03-20 20:28:23 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-13 18:55:40
 */

import { Row, Col, Card, Avatar, Icon } from 'antd';
import { Send } from 'HttpPost';
import Config from 'config';
import { Colors } from 'theme';
import { AUDIT_STATE } from 'constantclient';
const { Meta } = Card;

export default class ClientBasic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            
            nickname: '',
            avatar: '',
            mobile: '',
            level: '',
            gemNumber: '',
            uuid: '',
            status: '',
            createTime: '',

            realName: '',
            alipay: '',
            idCard: '',
            auditState: '',
            bannedNumber: '',

            cityName: ""
        }
    }

    componentDidMount () {
        this.fetchBasic();
    }

    fetchBasic () {
        var that = this;
        if (!that.state.loading) that.setState({ loading: true });
        Send('User.getUserStatictics', { clientId: this.props.clientId, _uid: this.props.userId }, response => {
            if (that.state.loading) that.setState({ loading: false });
            if (response['success']) {
                let { nickname, avatar, mobile, level, gemNumber, uuid, status, createTime, realName, alipay, idCard, auditState, bannedNumber, cityName } = response['data'];
                that.setState({ nickname, avatar, mobile, level, gemNumber, uuid, status, createTime, realName, alipay, idCard, auditState, bannedNumber, cityName });
            }
        });
    }

    renderMetaDescription () {
        let { mobile, gemNumber, createTime, cityName } = this.state;
        return (
            <div stylle={{ margin: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type="phone" style={{ color: Colors.C9 }} />
                    <p style={Styles.metaText}>{mobile}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type="crown" style={{ color: Colors.C11 }} />
                    <p style={Styles.metaText}>{`${gemNumber}枚`}</p>
                </div>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type="mobile" style={{ color: Colors.C12 }} />
                    <p style={Styles.metaText}>{moment(createTime).format('YYYY年MM月DD日')}</p>
                </div>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type="environment" style={{ color: Colors.C9 }} />
                    <p style={Styles.metaText}>{cityName}</p>
                </div>
            </div>
        )
    }

    renderMetaTitle () {
        let { nickname, level } = this.state;
        return (
            <div style={{ display: 'flex', flexDirection: 'row', margin: 0 }}>
                <p style={{ margin: 2, fontSize: 16 }}>{nickname}</p>
                <p style={{ margin: 2, fontSize: 16, color: Colors.C11 }}>{`${level.toUpperCase()}`}</p>
            </div>
        )
    }

    render () {
        let { avatar, realName, alipay, idCard, auditState, bannedNumber, loading } = this.state;
        avatar = avatar ? Config.RES_PATH + avatar : 'http://img2015.zdface.com/20190321/5fb31a01c656acc19f247de69272a653.jpg';
        return (
            <div>
                <Row gutter={23}>
                    <Col span={7}>
                        <Card
                            cover={<img alt="example" src={`${avatar}`} style={{ maxHeight: 450 }} />}
                            actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                            hoverable
                            loading={loading}
                        >
                            <Meta
                                avatar={<Avatar src={`${avatar}`} />}
                                title={this.renderMetaTitle()}
                                description={this.renderMetaDescription()}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <div style={{ padding: 10, background: '#ECECEC' }}>
                            <Card
                                title="实名认证"
                                hoverable>
                                {auditState === '2' ?
                                    <div>
                                        <p style={{ fontWeight: '500' }}>状态</p>
                                        <p>{auditState.toString().trim() === '' || AUDIT_STATE[auditState]['value']}</p>
                                        <p style={{ fontWeight: 500 }}>姓名</p>
                                        <p>{realName}</p>
                                        <p style={{ fontWeight: 500 }}>身份证</p>
                                        <p>{idCard}</p>
                                        <p style={{ fontWeight: 500 }}>支付宝</p>
                                        <p>{alipay}</p>
                                    </div>
                                    :
                                    <p>{auditState.toString().trim() === '' ? '未认证' : AUDIT_STATE[auditState]['value']}</p>
                                }
                            </Card>
                        </div>
                    </Col>
                    <Col span={5}>
                        <div style={{ padding: 10, background: '#ECECEC' }}>
                            <Card
                                title="账户状态"
                                hoverable>
                                <p style={{ color: bannedNumber === 0 ? 'green' : 'red' }}>{bannedNumber === 0 ? '正常' : '交易封禁中...'}</p>
                            </Card>
                        </div>
                    </Col>
                    <Col span={5}>
                        <div style={{ padding: 10, background: '#ECECEC' }}>
                            <Card
                                title="本月封禁次数"
                                hoverable>
                                <p style={{ color: bannedNumber === 0 ? 'green' : 'red' }}>{bannedNumber}</p>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const Styles = {
    metaText: { margin: 2, fontSize: 14 }
}