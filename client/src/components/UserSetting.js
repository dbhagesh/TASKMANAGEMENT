import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Form, Input, message, Modal, Avatar } from 'antd';


const BASE_URL = process.env.REACT_APP_BASE_URL;

function UserSetting({ user_id, user_name, user_email, setUserDetails }) {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const name_form = Form.useWatch('name', form);
    const email_form = Form.useWatch('email', form);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);

        await onFinish({ name_form, email_form });
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
                user_id: user_id,
                user_name: values.name_form,
                user_email: values.email_form,
            };
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.put(
                `${BASE_URL}/auth/updateUser`,
                body,
                headers
            );

            message.success('User Details Updated');
            form.resetFields();
            setUserDetails(data);

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
            <Avatar
                className="dashboard-wrapper-header-logo"
                onClick={showModal}
            >
                {user_name[0]}
            </Avatar>
            <div className='dashboard-wrapper-header-username'>
                Hello {user_name} !
            </div>
            {/* <Button danger type={'primary'} className='taskoptions-btn-3'  shape="circle" size={'small'} icon={<EditFilled />} /> */}

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
                        user_id: user_id,
                        name: user_name,
                        email: user_email,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item
                        name="user_id"
                        label="User ID"

                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"

                        rules={[
                            {
                                required: true,
                                message: 'Please input your user name to change!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input email to change',
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

export default UserSetting