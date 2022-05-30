import React, { useState, useEffect } from 'react';
import axios from "axios";
import { message, Modal, Button, Table, Space } from 'antd';

const BASE_URL = process.env.REACT_APP_BASE_URL;




function ViewNotificationsModal({ setCreatedProject, CreatedProject }) {
    const [Invitations, setInvitations] = useState([]);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [ConfirmRender, setConfirmRender] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };


    const fetchInvites = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.get(
                `${BASE_URL}/dashboard/fetchInvites`,
                config
            );

            setInvitations(data)
            // message.success('Invitations Fetched');

        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }

    };

    const acceptInvite = async ({ invitation_id }) => {
        try {

            const body = {
                invitation_id: invitation_id
            };

            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.post(
                `${BASE_URL}/dashboard/acceptInvite`,
                body,
                headers
            );

            message.success('Invitation Accepted');
            // setConfirmRender(!ConfirmRender);
            setCreatedProject(true);

        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }
    };

    const rejectInvite = async ({ invitation_id }) => {
        try {
            const body = {
                invitation_id: invitation_id
            };

            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.post(
                `${BASE_URL}/dashboard/rejectInvite`,
                body,
                headers
            );

            message.warning('Invitation Rejected');
            setConfirmRender(!ConfirmRender);
        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }
    };

    const undoInvite = async ({ invitation_id }) => {
        try {
            const body = {
                invitation_id: invitation_id
            };

            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.post(
                `${BASE_URL}/dashboard/undoInvite`,
                body,
                headers
            );

            message.warning('Invitation Undone');
            setConfirmRender(!ConfirmRender);
        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }
    };

    useEffect(() => {
        fetchInvites()
    }, [CreatedProject, ConfirmRender])


    const columnsReceived = [
        {
            title: 'From',
            dataIndex: 'invitation_by_user_id_fk',
            key: 'invitation_by_user_id_fk',
        },
        {
            title: 'Project',
            dataIndex: 'project_id_fk',
            key: 'project_id_fk',
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => acceptInvite(record)}>Accept</Button>
                    <Button danger type="primary" onClick={() => rejectInvite(record)}>Reject</Button>
                </Space>
            ),
        },
    ];

    const columnsSent = [
        {
            title: 'To',
            dataIndex: 'invitation_to_user_id_fk',
            key: 'invitation_to_user_id_fk',
        },
        {
            title: 'Project',
            dataIndex: 'project_id_fk',
            key: 'project_id_fk',
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Button danger type="primary" onClick={() => undoInvite(record)}>Undo</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Notifications
            </Button>
            <Modal
                title="Notifications"
                visible={visible}
                onOk={handleCancel}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1000}
            >
                <p>Invitations Received</p>
                <Table dataSource={Invitations[0]} columns={columnsReceived} />
                <p>Invitations Sent</p>
                <Table dataSource={Invitations[1]} columns={columnsSent} />
            </Modal>
        </>
    )
}

export default ViewNotificationsModal