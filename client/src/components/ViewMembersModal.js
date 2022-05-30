import React, { useState, useEffect } from 'react';
import axios from "axios";
import { message, Modal, Button, Table, Space } from 'antd';
import { Descriptions, Badge } from 'antd';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const columns = [
    {
        title: 'Name',
        dataIndex: 'user_name',
        key: 'user_name',
    },
    {
        title: 'Email',
        dataIndex: 'user_email',
        key: 'user_email',
    },
    {
        title: 'ID',
        dataIndex: 'user_id',
        key: 'user_id',
    },
];

function ViewMembersModal({ project }) {
    const [Rows, setRows] = useState([]);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };


    const fetchMembers = async () => {
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
                `${BASE_URL}/dashboard/fetchMembers`,
                config
            );

            setRows(data)
            // message.success('Members Fetched');

        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }

    };

    useEffect(() => {
        fetchMembers()
    }, [project])

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Members & Info
            </Button>
            <Modal
                title="Project Members"
                visible={visible}
                onOk={handleCancel}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
            >

                <Descriptions title="Project Information" bordered>
                    <Descriptions.Item label="Project Id" span={2}> {project['project_id']}</Descriptions.Item>
                    <Descriptions.Item label="Project Name"> {project['project_name']}</Descriptions.Item>
                    <Descriptions.Item label="Project Description" span={3}>  {project['project_description']}</Descriptions.Item>
                    <Descriptions.Item label="Project Owner" span={2}>  {project['user_id']}</Descriptions.Item>
                </Descriptions>
                <br />
                <h3><b>Project Members</b></h3>
                <br />
                <Table dataSource={Rows} columns={columns} />

            </Modal>
        </>
    )
}

export default ViewMembersModal