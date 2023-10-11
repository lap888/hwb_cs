/*
 * @Author: fantao.meng
 * @Date: 2019-04-27 13:30:13
 * @Last Modified by: fantao.meng
 * @Last Modified time: 2019-05-02 20:29:36
 */
import {Modal, Form, Button, Input, Select, InputNumber, Switch, Row, Col, Upload, Card, message} from 'antd';
const { TextArea } = Input;
import { connect } from 'react-redux';
import { Send } from 'HttpPost';
class GameSupplier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            gameSupplierList: [],
            currentPage: 1,
            totalNumber: 1,
            supplierList:[],
            gameCategoryList:[],
        }
    }
    componentDidMount() {
        this.fetchGameCategoryList();
        this.fetchGameSupplierList();
    }
    //获取所有的游戏供应商
    fetchGameSupplierList () {
        var that = this;
        Send('Game.supplierList', {page:1,_uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let { list } = response['data'];
                that.setState({supplierList: list });
                console.log("供应商：=========》》",this.state.supplierList);
            }
        });
    }
    //获取游戏分类列表
    fetchGameCategoryList () {
        var that = this;
        Send('Game.getGameCategories', {page:1,_uid: this.props.userId }, response => {
            if (that.state.isLoading) that.setState({ isLoading: false });
            if (response['success']) {
                let {list} = response['data'];
                that.setState({gameCategoryList: list });
                console.log("游戏分类列表========>>",gameCategoryList);
            }
        });
    }
    handleCancel = () => this.setState({ previewVisible: false });
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    handleChange = ({ fileList }) => this.setState({ fileList });
    /**
     * 渲染添加游戏表单
     */
    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { previewVisible, previewImage, fileList } = this.state;
        const Option = Select.Option;
        //初始化字段
        let {g_title,g_size,g_version,gt_VIP,gt_pinyin,g_h5_url,g_type, g_platform,game_supplier,game_category_id,use_gem_rate,discount,sdw_id,use_gem,company_share_ratio,synopsis,is_show } = this.state;
        //默认在app中显示(1开,0关)
        this.state.is_show=1;
        this.state.use_gem=0;
        //确认数据，发起添加请求
        const confirmdata = () => {
            let data = {
                g_title:this.state.g_title,g_size:this.state.g_size,g_version:this.state.g_version,gt_VIP:this.state.gt_VIP,gt_pinyin:this.state.gt_pinyin,g_h5_url:this.state.g_h5_url,g_type:this.state.g_type,
                g_platform:parseInt(this.state.g_platform),game_supplier_id:this.state.game_supplier,game_category_id:this.state.game_category_id,use_gem_rate:this.state.use_gem_rate,
                discount:this.state.discount,sdw_id:parseInt(this.state.sdw_id),use_gem:this.state.use_gem,company_share_ratio:this.state.company_share_ratio,synopsis:this.state.synopsis,is_show:this.state.is_show
            };
            console.log("添加数据！",data);
            var that = this;
            if (!that.state.isLoading) that.setState({ isLoading: true });
            Send('Game.insertGameCategorie', data, response => {
                if (response['success']) {
                    message.success(response['errorMsg']);
                } else {
                    message.error(response['errorMsg']);
                }
            });
        };
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', background: '#FFFFFF' }}>
                    <Card
                        title="添加游戏"
                        extra={<a href="#/game">返回</a>}>
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="游戏名称："{...formItemLayout}>
                                        <Input placeholder="请输入游戏名称！" defaultValue={g_title } value={g_title } onChange={event => {
                                            this.setState({ g_title : event.target.value }, () => {})
                                        }}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="游戏大小："{...formItemLayout}>
                                        <Input placeholder="请输入游戏大小！" defaultValue={g_size } value={g_size } onChange={event => {
                                            this.setState({ g_size : event.target.value }, () => {})
                                        }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="游戏版本"
                                        {...formItemLayout}>
                                        <Input placeholder="请输入游戏版本！" defaultValue={g_version } value={g_version } onChange={event => {
                                            this.setState({ g_version : event.target.value }, () => {
                                            })
                                        }}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="VIP福利"
                                        {...formItemLayout}>
                                        <Input placeholder="请输入游戏VIP福利！" defaultValue={gt_VIP } value={gt_VIP} onChange={event => {
                                            this.setState({ gt_VIP: event.target.value }, () => {
                                            })
                                        }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="Pinyin"
                                        {...formItemLayout}>
                                        <Input placeholder="请输入Pinyin！" defaultValue={gt_pinyin} value={gt_pinyin} onChange={event => {
                                            this.setState({ gt_pinyin: event.target.value }, () => {
                                            })
                                        }}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="H5链接:"
                                        {...formItemLayout}>
                                        <Input placeholder="请输入H5链接！" defaultValue={g_h5_url} value={g_h5_url} onChange={event => {
                                            this.setState({ g_h5_url: event.target.value }, () => {
                                            })
                                        }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="游戏种类："{...formItemLayout}>
                                        <Select placeholder="请选择游戏种类！" defaultValue={g_type } onChange={(value)=>{
                                            this.state.g_type=value;
                                        }}>
                                            <Option value="APP">APP</Option>
                                            <Option value="H5">H5</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="游戏平台："{...formItemLayout}>
                                        <Select placeholder="请选择游戏平台！" defaultValue={g_platform} onChange={(value)=>{
                                            this.state.g_platform=value;}}>
                                            <Option value="0">跨平台</Option>
                                            <Option value="1">IOS</Option>
                                            <Option value="2">Android</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="游戏供应商"
                                        {...formItemLayout}>
                                        <Select placeholder="请选择游戏供应商！" defaultValue={game_supplier} onChange={(value)=>{
                                            this.state.game_supplier=value;}}>
                                            {this.state.supplierList.map(item => <Option key={item['supplierId']} value={item['supplierId']}>{item['supplierName']}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="游戏种类："{...formItemLayout}>
                                        <Select placeholder="请选择游戏种类！" defaultValue={game_category_id} onChange={(value)=>{
                                            this.state.game_category_id=value;}}>
                                            {this.state.gameCategoryList.map(item => <Option key={item['id']} value={item['id']}>{item['name']}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        style={Styles.actionFormItem}
                                        label="分成比例 -(计算上级分红)"
                                        {...formItemLayout}>
                                        <InputNumber min={0} max={10} step={0.1} defaultValue={company_share_ratio} onChange={(value) => {
                                            this.state.company_share_ratio=value;
                                        }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        style={Styles.actionFormItem}
                                        label="闪电玩id-(渠道是电魂填写)"
                                        {...formItemLayout}>
                                        <InputNumber min={1} defaultValue={sdw_id} onChange={(value)=>{
                                            this.state.sdw_id = value;
                                        }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="充值比例"
                                        {...formItemLayout}>
                                        <InputNumber disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="折扣"
                                        {...formItemLayout}>
                                        <InputNumber defaultValue={discount} onChange={(value)=>{
                                            this.state.discount = value;
                                        }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="钻石抵扣比例"
                                        {...formItemLayout}>
                                        <InputNumber min={0} max={10} step={0.1} defaultValue={use_gem_rate} onChange={(value => {
                                            this.state.use_gem_rate = value;
                                        })}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        style={Styles.actionFormItem}
                                        label="游戏描述"
                                        {...formItemLayout}>
                                        <TextArea defaultValue={synopsis} value={synopsis} onChange={event => {
                                            this.setState({ synopsis : event.target.value }, () => {})
                                        }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="是否可用钻石抵扣"
                                        {...formItemLayout}>
                                        <Switch defaultValue={use_gem} onChange={(value)=>{
                                            console.log(value)
                                            if (value){
                                                this.state.use_gem=1;
                                            } else {
                                                this.state.use_gem=0;
                                            }
                                        }}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="是否在app中展示"
                                        {...formItemLayout}>
                                        <Switch defaultChecked  defaultValue={is_show} onChange={(value)=>{
                                            console.log(value)
                                            if(value){
                                                this.state.is_show=1;
                                            }else {
                                                this.state.is_show=0;
                                            }
                                        }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="游戏Logo"
                                        {...formItemLayout}>
                                        <Upload
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            listType="picture-card"
                                            fileList={fileList}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleChange}
                                        >
                                            {}
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="图片"
                                        {...formItemLayout}>
                                        <p></p>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3}>
                                </Col>
                                <Col span={4}>
                                </Col>
                                <Col span={4}>
                                    <Button type="danger" shape="round"  href="#/game">取消添加</Button>
                                </Col>
                                <Col span={4}>
                                    <Button type="primary" shape="round" onClick={confirmdata}>确认添加</Button>
                                </Col>
                            </Row>
                            <br/>
                        </Form>
                    </Card>
            </div>
        )
    }
}
const mapStateToProps = state => ({userId: state.user.userId});
export default connect(mapStateToProps, {})(GameSupplier);
const Styles = {};

