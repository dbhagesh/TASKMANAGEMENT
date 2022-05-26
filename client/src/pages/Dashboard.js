import { Breadcrumb, Layout, Menu } from 'antd';
import React from 'react';
import { Card, Col, Row } from 'antd';
const { Header, Content, Sider } = Layout;

const items1 = ['Create Project', 'Project Members', 'Notifications', 'Logout'].map((name, index) => {
    const key = String(index + 1);
    return {
        key: `sub${key}`,
        // icon: React.createElement(icon),
        label: name,
    };
});
const items2 = ['Project 1', 'Project 2', 'Project 3'].map((name, index) => {
    const key = String(index + 1);
    return {
        key: `sub${key}`,
        label: name
    };
});

const Dashboard = () => (
    <Layout className='dashboard-wrapper'>
        <Header className="dashboard-wrapper-header">
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} onClick={console.log("Clicked")} />
        </Header>
        <Layout>
            <Sider width={200} className="site-layout-background">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{
                        height: '100%',
                        borderRight: 0,
                        overflow: 'scroll',
                        overflowX: 'hidden',
                    }}
                    items={items2}
                    onClick={console.log("clicked")}
                />
            </Sider>
            <Layout
                style={{
                    padding: '0 24px 24px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>Current Project</Breadcrumb.Item>
                    <Breadcrumb.Item>Project Manager</Breadcrumb.Item>

                </Breadcrumb>
                {/* <div className='dashboard-wrapper-content'>
                    <div className='dashboard-wrapper-content-assigned'></div>
                    <div className='dashboard-wrapper-content-doing'></div>
                    <div className='dashboard-wrapper-content-completed'></div>
                </div> */}
                <div className="dashboard-wrapper-content">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="Assigned" bordered={false} className="dashboard-wrapper-content-assigned">
                                <Col>
                                    <Card title="Card title" bordered={false} className="dashboard-wrapper-content-assigned-cards">
                                        Card content
                                    </Card>
                                    <Card title="Card title" bordered={false} className="dashboard-wrapper-content-assigned-cards">
                                        Card content
                                    </Card>
                                    <Card title="Card title" bordered={false} className="dashboard-wrapper-content-assigned-cards">
                                        Card content
                                    </Card>
                                    <Card title="Card title" bordered={false} className="dashboard-wrapper-content-assigned-cards">
                                        Card content
                                    </Card>
                                    <Card title="Card title" bordered={false} className="dashboard-wrapper-content-assigned-cards">
                                        Card content
                                    </Card>
                                    <Card title="Card title" bordered={false} className="dashboard-wrapper-content-assigned-cards">
                                        Card content
                                    </Card>
                                    <Card title="Card title" bordered={false} className="dashboard-wrapper-content-assigned-cards">
                                        Card content
                                    </Card>
                                    <Card title="Card title" bordered={false} className="dashboard-wrapper-content-assigned-cards">
                                        Card content
                                    </Card>
                                    <Card title="Card title" bordered={false} className="dashboard-wrapper-content-assigned-cards">
                                        Card content
                                    </Card>
                                </Col>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Doing" bordered={false} className="dashboard-wrapper-content-doing">
                                Card content
                            </Card>
                        </Col>
                        <Col span={8} >
                            <Card title="Completed" bordered={false} className="dashboard-wrapper-content-completed">
                                Card content
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Layout>
        </Layout>
    </Layout>
);

export default Dashboard;