import { Breadcrumb, Layout, message, Avatar, Button, Switch, Divider, Badge, Result } from 'antd';
import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { InfoCircleOutlined } from '@ant-design/icons';

import CreateProjectModal from '../components/CreateProjectModal';
import ViewMembersModal from '../components/ViewMembersModal';
import ViewNotificationsModal from '../components/ViewNotificationModal';
import ProjectSider from '../components/ProjectSider';
import Invite from '../components/Invite';
import CreateTaskModal from '../components/CreateTask';
import TaskOptions from '../components/TaskOptions';
import UserSetting from '../components/UserSetting';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const { Header } = Layout;


const Dashboard = () => {
    let navigate = useNavigate();

    const [userDetails, setUserDetails] = useState();
    const [project, setProject] = useState();
    const [CreatedProject, setCreatedProject] = useState(false);
    const [TaskRender, setTaskRender] = useState(false);
    const [Tasks, setTasks] = useState([[], [], []])
    const [TaskFetchSwitch, setTaskFetchSwitch] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [])

    useEffect(() => {
        fetchTasks();
    }, [project])


    useEffect(() => {

    }, [CreatedProject])

    useEffect(() => {
        fetchTasks();
    }, [TaskRender])

    useEffect(() => {
        fetchTasks();
    }, [TaskFetchSwitch])


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
            let response;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                },
                params: {
                    project_id: project['project_id'],
                }
            };

            if (TaskFetchSwitch) {
                response = await axios.get(
                    `${BASE_URL}/dashboard/fetchOwnTasks`,
                    config
                );
            }
            else {
                response = await axios.get(
                    `${BASE_URL}/dashboard/fetchTasks`,
                    config
                );
            }
            const { data } = response;

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
                {
                    userDetails ?
                        <UserSetting user_name={userDetails['user_name']} user_email={userDetails['user_email']} user_id={userDetails['user_id']} setUserDetails={setUserDetails} />
                        :
                        <></>

                }
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
                            <Breadcrumb.Item>Current Project : {project['project_id']}</Breadcrumb.Item>
                            <Breadcrumb.Item>Project Manager : {project['user_id']}</Breadcrumb.Item>

                            Global
                            &nbsp;
                            <Switch onChange={() => { setTaskFetchSwitch(!TaskFetchSwitch) }} />
                            &nbsp;
                            Local


                        </Breadcrumb>
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
                                                Tasks[0].map(({ task_name, task_priority, task_description, task_id, task_users_count }) => {
                                                    return (

                                                        <Badge.Ribbon text="&nbsp;&nbsp;" color={
                                                            task_priority == 1 ? "green" : task_priority == 2 ? "yellow" : task_priority == 3 ? "red" : "grey"
                                                        } placement='start'>
                                                            <Badge count={task_users_count} className='badge-display-issue'>
                                                                <Card title={(<Badge status="default" text={task_name} />)} bordered={false} className={"dashboard-wrapper-content-assigned-cards priority" + task_priority}
                                                                    extra={<TaskOptions TaskRender={TaskRender} task_name={task_name} task_priority={task_priority} task_description={task_description} task_id={task_id} setTaskRender={setTaskRender} project={project} task_type={1} />}
                                                                >
                                                                    <p><b>{task_id.toUpperCase()}</b></p>
                                                                    <Divider className='divider' />
                                                                    <p>{task_description}</p>
                                                                </Card>
                                                            </Badge>
                                                        </Badge.Ribbon>
                                                    )

                                                })
                                            }

                                        </Col>
                                    </Card>

                                </Col>
                                <Col span={8}>
                                    <Card title={<h3><b>Doing</b></h3>} bordered={false} className="dashboard-wrapper-content-doing">
                                        <Col>
                                            {
                                                Tasks[1].map(({ task_name, task_priority, task_description, task_id, task_users_count }) => {
                                                    return (
                                                        <Badge.Ribbon text="&nbsp;&nbsp;" color={
                                                            task_priority == 1 ? "green" : task_priority == 2 ? "yellow" : task_priority == 3 ? "red" : "grey"
                                                        } placement='start'>
                                                            <Badge count={task_users_count} className='badge-display-issue'>
                                                                <Card title={(<Badge status="processing" text={task_name} />)} bordered={false} className={"dashboard-wrapper-content-assigned-cards priority" + task_priority}
                                                                    extra={<TaskOptions TaskRender={TaskRender} task_name={task_name} task_priority={task_priority} task_description={task_description} task_id={task_id} setTaskRender={setTaskRender} project={project} task_type={2} />}
                                                                >
                                                                    <p><b>{task_id.toUpperCase()}</b></p>
                                                                    <Divider className='divider' />
                                                                    <p>{task_description}</p>
                                                                </Card>
                                                            </Badge>
                                                        </Badge.Ribbon>
                                                    )

                                                })
                                            }
                                        </Col>
                                    </Card>
                                </Col>
                                <Col span={8} >
                                    <Card title={<h3><b>Completed</b></h3>} bordered={false} className="dashboard-wrapper-content-completed">
                                        <Col>
                                            {
                                                Tasks[2].map(({ task_name, task_priority, task_description, task_id, task_users_count }) => {
                                                    return (
                                                        <Badge.Ribbon text="&nbsp;&nbsp;" color={
                                                            task_priority == 1 ? "green" : task_priority == 2 ? "yellow" : task_priority == 3 ? "red" : "grey"
                                                        } placement='start'>
                                                            <Badge count={task_users_count} className='badge-display-issue'>
                                                                <Card title={(<Badge status="success" text={task_name} />)} bordered={false} className={"dashboard-wrapper-content-assigned-cards priority" + task_priority}
                                                                    extra={<TaskOptions TaskRender={TaskRender} task_name={task_name} task_priority={task_priority} task_description={task_description} task_id={task_id} setTaskRender={setTaskRender} project={project} task_type={3} />}
                                                                >
                                                                    <p><b>{task_id.toUpperCase()}</b></p>
                                                                    <Divider className='divider' />
                                                                    <p>{task_description}</p>
                                                                </Card>
                                                            </Badge>
                                                        </Badge.Ribbon>
                                                    )

                                                })
                                            }
                                        </Col>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Layout>) : (
                        <div className='dashboard-wrapper-nocontent'>
                            <Result title="No project selected"
                            />
                        </div>

                    )
                }

            </Layout>
        </Layout>
    )
};

export default Dashboard;