import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, message, Modal, Button } from 'antd';


const BASE_URL = process.env.REACT_APP_BASE_URL;

function CreateProjectModal({ setCreatedProject }) {
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const name = Form.useWatch('name', form);
    const description = Form.useWatch('description', form);

    const showModal = () => {
        setVisible(true);
    };
    const handleOk = async () => {
        setConfirmLoading(true);
        await onFinish({ name, description });
        setConfirmLoading(false);
        setVisible(false);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };


    const onFinish = async (values) => {
        try {
            const body = {
                project_name: values.name,
                project_description: values.description
            };
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.post(
                `${BASE_URL}/dashboard/createProject`,
                body,
                headers
            );

            message.success('Project Created');
            setCreatedProject(true);
            form.resetFields();

        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }

    };

    const onFinishFailed = (errorInfo) => {
        message.error(errorInfo);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Create Project
            </Button>
            <Modal
                title="Create Project"
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
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your project name!',
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
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default CreateProjectModal