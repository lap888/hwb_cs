/*
 * @Author: fantao.meng 
 * @Date: 2019-03-20 17:02:42 
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-04 00:59:44
 */

import { Card, Col, Row } from 'antd';
import { connect } from 'react-redux';

import ClientBasic from './ClientBasic';
import ClientDiamond from './ClientDiamond';
import ClientMining from './ClientMining';
import ClientTransaction from './ClientTransaction';
import ClientDividend from './ClientDividend';
import ClientRecharge from './ClientRecharge';
import ClientActivity from './ClientActivity';
import ClientContribute from './ClientContribute';
import ClientHonor from './ClientHonor';
import ClientTeam from './ClientTeam';

class ClientInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleKey: 'table1',
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.params.clientId !== this.props.clientId) {
            if (this.state.titleKey !== "table1") this.onTabChange("table1", "titleKey");
        }
    }

    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    }

    render () {
        const tabList = [{
            key: 'table1',
            tab: '基本信息',
        }, {
            key: 'table2',
            tab: '钻石',
        }, {
            key: 'table3',
            tab: '矿机',
        }, {
            key: 'table4',
            tab: '交易',
        }, {
            key: 'table5',
            tab: '钱包',
        }, {
            key: 'table6',
            tab: '充值',
        }, {
            key: 'table7',
            tab: '活跃度',
        }, {
            key: 'table8',
            tab: '贡献值',
        }, {
            key: 'table9',
            tab: '荣誉值',
        }, {
            key: 'table10',
            tab: '团队',
        }];
        let clientId = this.props.params.clientId;
        let userId = this.props.userId;
        const contentListTitle = {
            table1: <ClientBasic clientId={clientId} userId={userId} router={this.props.router} />,
            table2: <ClientDiamond clientId={clientId} userId={userId} router={this.props.router} />,
            table3: <ClientMining clientId={clientId} userId={userId} router={this.props.router} />,
            table4: <ClientTransaction clientId={clientId} userId={userId} router={this.props.router} />,
            table5: <ClientDividend clientId={clientId} userId={userId} router={this.props.router} />,
            table6: <ClientRecharge clientId={clientId} userId={userId} router={this.props.router} />,
            table7: <ClientActivity clientId={clientId} userId={userId} router={this.props.router} />,
            table8: <ClientContribute clientId={clientId} userId={userId} router={this.props.router} />,
            table9: <ClientHonor clientId={clientId} userId={userId} router={this.props.router} />,
            table10: <ClientTeam clientId={clientId} userId={userId} router={this.props.router} />,
        };
        return (
            <div>
                <Card
                    style={{ }}
                    title="客户信息360视图"
                    hoverable
                    extra={<a href="#">More</a>}>
                    <Card
                        style={{ marginTop: 20 }}
                        tabList={tabList}
                        activeTabKey={this.state.titleKey}
                        onTabChange={(key) => { this.onTabChange(key, 'titleKey'); }}
                        >
                        {contentListTitle[this.state.titleKey]}
                    </Card>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.user.userId
});

export default connect(mapStateToProps, {})(ClientInfo);