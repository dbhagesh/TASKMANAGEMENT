import { Breadcrumb, Layout, Menu, message, Avatar } from 'antd';
import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const { Header, Content, Sider } = Layout;

const items1 = ['Create Project', 'Project Members', 'Notifications', 'Logout'].map((name, index) => {
    const key = String(index + 1);
    return {
        key: `sub${key}`,
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


const Dashboard = () => {
    let navigate = useNavigate();
    const [userDetails, setUserDetails] = useState();

    useEffect(() => {
        fetchUserDetails();
    }, [userDetails])


    if (!localStorage.getItem("TM_token")) {
        message.warning("Login to access dashboard!")
        return <Navigate to="/" replace={true} />
    }




    const fetchUserDetails = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };

            const { data } = await axios.get(
                `${BASE_URL}/dashboard`,
                config
            );

            setUserDetails(data);
        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }
    }



    const logout = () => {
        localStorage.removeItem("TM_token");
        navigate("/", { replace: true });
        message.error("Logged Out");
    }

    const createProject = () => {

    }

    const viewMembers = () => {

    }

    const viewNotifications = () => {

    }

    return (
        <Layout className='dashboard-wrapper'>
            <Header className="dashboard-wrapper-header">

                <Avatar
                    className="dashboard-wrapper-header-logo"
                >
                    {(userDetails) ? userDetails['user_name'][0] : 'U'}
                </Avatar>
                <div className='dashboard-wrapper-header-username'>
                    Hello {(userDetails) ? userDetails['user_name'] : 'User'} !
                </div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} onClick={(e) => {
                    if (e.key === 'sub1') {
                        createProject();
                    }
                    else if (e.key === 'sub2') {
                        viewMembers();
                    }
                    else if (e.key === 'sub3') {
                        viewNotifications();
                    }
                    else if (e.key === 'sub4') {
                        logout();
                    }
                }
                } />
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
    )
};

export default Dashboard;