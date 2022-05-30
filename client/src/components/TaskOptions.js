import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Form, Input, message, Modal, Button, Select, Table } from 'antd';
import { EditFilled, UserAddOutlined, CheckOutlined } from '@ant-design/icons';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const columns = [
    {
        title: 'Timestamp of Allocation',
        dataIndex: 'timestamp',
        key: 'timestamp',
    },
    {
        title: 'User ID',
        dataIndex: 'user_id_fk',
        key: 'user_id_fk',
    }
];

function TaskOptions({ TaskRender, setTaskRender, project, task_name, task_priority, task_description, task_id, task_type }) {
    const { Option } = Select;

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const name_form = Form.useWatch('name', form);
    const description_form = Form.useWatch('description', form);
    const task_type_form = Form.useWatch('task_type', form);
    const task_priority_form = Form.useWatch('task_priority', form);

    const showModal = () => {
        setVisible(true);
    };
    const handleOk = async () => {
        setConfirmLoading(true);
        await onFinish({ name_form, description_form, task_type_form, task_priority_form });
        setConfirmLoading(false);
        setVisible(false);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        form.resetFields();
        setVisible(false);
    };

    const onFinish = async (values) => {
        try {
            const body = {
                task_id: task_id,
                task_name: values.name_form,
                task_description: values.description_form,
                task_type: values.task_type_form,
                task_priority: values.task_priority_form,
                project_id: project['project_id']
            };
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.put(
                `${BASE_URL}/dashboard/modifyTask`,
                body,
                headers
            );

            message.success('Task Modified');
            form.resetFields();
            setTaskRender(!TaskRender);
        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }

    };

    const onFinishFailed = (errorInfo) => {
        message.error(errorInfo);
    };


    /********************Modal for Adding User to task*********************/

    const [formAdd] = Form.useForm();
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);
    const [UserAdd, setUserAdd] = useState(false);
    const user_id = Form.useWatch('user_id', formAdd);

    const showModalAdd = () => {
        setVisibleAdd(true);
    };
    const handleOkAdd = async () => {
        setConfirmLoadingAdd(true);
        await onFinishAdd({ user_id });
        setConfirmLoadingAdd(false);
        setVisibleAdd(false);
    };

    const handleCancelAdd = () => {
        console.log('Clicked cancel button');
        formAdd.resetFields();
        setVisibleAdd(false);
    };


    const onFinishAdd = async (values) => {
        try {
            const body = {
                user_id: values.user_id,
                task_id: task_id,
                project_id: project['project_id']
            };
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.post(
                `${BASE_URL}/dashboard/allocate`,
                body,
                headers
            );

            message.success('Task Alloted to user');
            formAdd.resetFields();
            setTaskRender(!TaskRender);
            setUserAdd(!UserAdd);
        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }

    };

    const onFinishFailedAdd = (errorInfo) => {
        message.error(errorInfo);
    };

    /*************MOVE TO NEXT***************/

    const moveToNext = async () => {
        try {
            const body = {
                task_id: task_id,
                task_name: task_name,
                task_description: task_description,
                task_type: task_type + 1,
                task_priority: task_priority,
                project_id: project['project_id']
            };
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.put(
                `${BASE_URL}/dashboard/modifyTask`,
                body,
                headers
            );

            message.success('Task Modified');
            form.resetFields();
            setTaskRender(!TaskRender);

        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }
    }


    /*************Fetch Task Users***************/

    const [TaskUsers, setTaskUsers] = useState([])

    const fetchTaskUsers = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                },
                params: {
                    task_id: task_id,
                    project_id: project['project_id']
                }
            };
            const { data } = await axios.get(
                `${BASE_URL}/dashboard/fetchTaskUsers`,
                config
            );

            // message.success('Task Users Fetched');
            setTaskUsers(data);
        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }
    }

    useEffect(() => {
        fetchTaskUsers()
    }, [UserAdd])

    return (
        <>
            <div className='taskoptions-btn'>
                {
                    task_type != 3 ?
                        <Button className='taskoptions-btn-1' type={'primary'} onClick={moveToNext} shape="circle" size={'small'} icon={<CheckOutlined />} />
                        :
                        <></>
                }

                <Button className='taskoptions-btn-2' type={'primary'} onClick={showModalAdd} shape="circle" size={'small'} icon={<UserAddOutlined />} />
                <Button danger type={'primary'} className='taskoptions-btn-3' onClick={showModal} shape="circle" size={'small'} icon={<EditFilled />} />
            </div>
            <Modal
                title="Edit Task"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Form form={form}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        task_id: task_id,
                        name: task_name,
                        description: task_description,
                        task_priority: task_priority,
                        task_type: task_type
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item
                        name="task_id"
                        label="Task ID"

                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"

                        rules={[
                            {
                                required: true,
                                message: 'Please input your task name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input description',
                            },
                        ]}
                    >
                        <Input.TextArea showCount maxLength={400} />
                    </Form.Item>

                    <Form.Item
                        name="task_priority"
                        label="Task Priority"

                    >
                        <Select>
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="task_type"
                        label="Task Type"

                    >
                        <Select >
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                        </Select>
                    </Form.Item>


                </Form>
            </Modal>

            <Modal
                title="Allocate Task"
                visible={visibleAdd}
                onOk={handleOkAdd}
                confirmLoading={confirmLoadingAdd}
                onCancel={handleCancelAdd}
            >
                <Form form={formAdd}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinishAdd}
                    onFinishFailed={onFinishFailedAdd}
                    autoComplete="off"
                >


                    <Form.Item
                        label="User ID"
                        name="user_id"

                        rules={[
                            {
                                required: true,
                                message: 'Please input User ID!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                </Form>
                <br />
                <Table dataSource={TaskUsers} columns={columns} />
            </Modal>
        </>
    )
}

export default TaskOptions