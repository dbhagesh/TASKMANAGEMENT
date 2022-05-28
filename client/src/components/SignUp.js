import React from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from 'antd';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const asyncLocalStorage = {
    setItem: async function (key, value) {
        await null;
        return localStorage.setItem(key, value);
    },
    getItem: async function (key) {
        await null;
        return localStorage.getItem(key);
    }
};

function Signup() {

    let navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                name: values.username,
                email: values.Email,
                password: values.password
            };


            const { data } = await axios.post(
                `${BASE_URL}/auth/register/`,
                config
            );
            asyncLocalStorage.setItem("TM_token", data.token).then(() => {
                message.success('Registered and Logged In');
                navigate("/dashboard", { replace: true });
            })

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
        <div className='signup-wrapper'>
            <div className='signup-wrapper-head'>
                Signup Page
            </div>
            <Form
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
                    label="Email"
                    name="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Signup