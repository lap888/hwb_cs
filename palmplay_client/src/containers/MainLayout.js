/*
 * @Author: fantao.meng 
 * @Date: 2019-04-08 23:29:54 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-09-16 18:37:55
 */

import { Layout, Menu, Icon, Button, Breadcrumb } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { LOGOUT } from 'ActionTypes';
import { MENU_ARRAY } from '../constants/layout';
import { Router } from 'react-router';
import { Send } from 'HttpPost';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class MainLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumb: ["首页"],
            collapsed: false,
            isShow: true
        }
    }

    /**
     * 点击MenuItem
     * @param {*} item 
     */
    onClickMenu(item) {
        let { key, title } = item;
        let breadcrumb = [title];
        let breadcrumbItem = MENU_ARRAY[key.substring(0, 1) - 1];

        if (breadcrumbItem.hasOwnProperty('submenu') && breadcrumbItem['submenu'].length > 0) {
            breadcrumb.splice(0, 0, breadcrumbItem['title']);
        }
        this.setState({ breadcrumb });
    }

    /**
     * 侧边导航展开、收起
     */
    onCollapse() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    /**
     * 渲染MenuItem
     * @param {*} item 
     */
    renderMenu(item) {
        let { key, title, icon } = item;
        
        if (item.hasOwnProperty('submenu') && item['submenu'].length > 0) {
            return (
                <SubMenu key={key} title={<span><Icon type={icon} /><span>{title}</span></span>}>
                    {item['submenu'].map(element => this.renderMenu(element))}
                </SubMenu>
            )
        } else {
            return (
                <Menu.Item key={key} onClick={() => this.onClickMenu(item)}>
                    <Icon type={icon} />
                    <span>{title}</span>
                    <Link to={item['path']}></Link>
                </Menu.Item>
            )
        }
    }

    /**
     * 渲染Sider
     */
    renderSider() {
        return (
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={() => this.onCollapse()}>
                <div className="logo" />
                <Menu
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}>
                    {MENU_ARRAY.map(item => this.renderMenu(item))}
                </Menu>
            </Sider>
        )
    }

    /**
     * 渲染Header 动态折叠
     */
    renderHeader() {
        return (
            <Header style={Styles.header}>
                <Button type="primary" onClick={() => this.onCollapse()}>
                    <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                </Button>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type='user' style={{ fontSize: 20 }} />
                    <p style={{ margin: 0, marginLeft: 8 }}>{`${this.props.roleName} ${this.props.nickname}`}</p>
                    <Button onClick={() => this.props.logout()} style={{ marginLeft: '10px' }}>登出</Button> 
                </div>
            </Header>
        )
    }

    /**
     * 渲染Content
     */
    renderContent() {
        return (
            <Content style={Styles.content}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    {this.state.breadcrumb.map((item, index) => <Breadcrumb.Item key={index.toString()}>{item}</Breadcrumb.Item>)}
                </Breadcrumb>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                    {this.props.children}
                </div>
            </Content>
        )
    }

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                {this.renderSider()}
                <Layout>
                    {this.renderHeader()}
                    {this.renderContent()}
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2018 Created by 掌玩科技
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    isLogged: state.user.isLogged,
    userId: state.user.userId,
    username: state.user.username,
    nickname: state.user.nickname,
    roleName: state.user.roleName,
    rights: state.user.rights,   
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({ type: LOGOUT }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);

const Styles = {
    header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', background: '#fff' },
    content: { display: 'flex', flex: 1, flexDirection: 'column', margin: '0 10px' },
};