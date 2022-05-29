import { Breadcrumb, Layout, Menu, message, Avatar, Modal, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

import CreateProjectModal from '../components/CreateProjectModal';
import ViewMembersModal from '../components/ViewMembersModal';
import ViewNotificationsModal from '../components/ViewNotificationModal';
import ProjectSider from '../components/ProjectSider';
import Invite from '../components/Invite';
import CreateTaskModal from '../components/CreateTask';
import TaskOptions from '../components/TaskOptions';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const { Header } = Layout;

const Dashboard = () => {
    let navigate = useNavigate();

    const [userDetails, setUserDetails] = useState();
    const [project, setProject] = useState();
    const [CreatedProject, setCreatedProject] = useState(false);
    const [TaskRender, setTaskRender] = useState(false);
    const [Tasks, setTasks] = useState([[], [], []])

    useEffect(() => {
        fetchUserDetails();
    }, [])

    useEffect(() => {
        fetchTasks();
    }, [project])


    useEffect(() => {

    }, [CreatedProject])

    useEffect(() => {

    }, [TaskRender])






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

    const fetchTasks = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                },
                params: {
                    project_id: project['project_id'],
                }
            };
            const { data } = await axios.get(
                `${BASE_URL}/dashboard/fetchTasks`,
                config
            );

            message.success('Tasks Fetched');
            setTasks(data);
            // setTaskRender(true);

        }
        catch (error) {
            console.log(error.response.data);
            message.error(error.response.data);
        }
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

                <CreateProjectModal setCreatedProject={setCreatedProject} />
                {
                    project ?
                        <ViewMembersModal project={project} />
                        :
                        <></>
                }

                <ViewNotificationsModal setCreatedProject={setCreatedProject} CreatedProject={CreatedProject} />
                <Invite />
                <Button type="primary" onClick={logout}>
                    Log Out
                </Button>

            </Header>
            <Layout>
                <ProjectSider setProject={setProject} CreatedProject={CreatedProject} />
                {
                    (project) ? (<Layout
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
                                    <Card title={<h3><b>Assigned</b></h3>} bordered={false} className="dashboard-wrapper-content-assigned" extra={
                                        <> {
                                            (project['user_id'] === userDetails['user_id']) ?
                                                < CreateTaskModal setTaskRender={setTaskRender} project={project} />
                                                :
                                                <></>
                                        }
                                        </>
                                    }>
                                        <Col>
                                            {
                                                Tasks[0].map(({ task_name, task_priority, task_description, task_id }) => {
                                                    return (
                                                        <Card title={task_name} bordered={false} className="dashboard-wrapper-content-assigned-cards"
                                                            extra={<TaskOptions />}
                                                        >
                                                            <p>{task_id}</p>
                                                            <p>{task_description}</p>
                                                            <p>{task_priority}</p>
                                                        </Card>
                                                    )

                                                })
                                            }


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
                    </Layout>) : (
                        <></>
                    )
                }

            </Layout>
        </Layout>
    )
};

export default Dashboard;