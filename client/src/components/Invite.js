import React, { useState } from 'react';
import axios from "axios";
import { Form, Input, message, Modal, Button } from 'antd';


const BASE_URL = process.env.REACT_APP_BASE_URL;

function Invite({ setCreatedProject }) {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const project_id = Form.useWatch('project_id', form);
    const user_email = Form.useWatch('user_email', form);

    const showModal = () => {
        setVisible(true);
    };
    const handleOk = async () => {
        setConfirmLoading(true);
        await onFinish({ project_id, user_email });
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
                project_id: values.project_id,
                user_email: values.user_email
            };
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.post(
                `${BASE_URL}/dashboard/invite`,
                body,
                headers
            );

            message.success('Invited..');
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
                Invite
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
                        label="Project ID"
                        name="project_id"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your project ID!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="user_email"
                        label="User Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input email of user to Invite',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Invite