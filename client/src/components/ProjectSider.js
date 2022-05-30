import React, { useState, useEffect } from 'react';
import { message, Menu, Layout } from 'antd';
import axios from "axios";
import { Empty } from 'antd';
const { Sider } = Layout;

const BASE_URL = process.env.REACT_APP_BASE_URL;

function ProjectSider({ setProject, CreatedProject }) {

    const [Projects, setProjects] = useState([]);

    const getProjects = async () => {
        try {
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("TM_token")}`
                }
            };
            const { data } = await axios.get(
                `${BASE_URL}/dashboard/fetchProjects`,
                headers
            );

            setProjects(data);

        }
        catch (error) {
            console.log(error.response.data)
            message.error(error.response.data);
        }

    };

    useEffect(() => {
        getProjects();
    }, [CreatedProject])


    const items2 = Projects.map((project, index) => {
        const key = String(index + 1);
        return {
            key: `${key}`,
            id: project['project_id'],
            label: project['project_name']
        };
    });


    return (
        <Sider width={200} className="site-layout-background">
            {(Projects && Projects.length == 0) ?
                <div style={{
                    height: '100%',
                    borderRight: 0,
                    overflow: 'scroll',
                    overflowX: 'hidden',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} >
                    <Empty />
                </div>
                :
                <Menu
                    mode="inline"
                    style={{
                        height: '100%',
                        borderRight: 0,
                        overflow: 'scroll',
                        overflowX: 'hidden',
                    }}
                    items={items2}
                    onClick={(e) => {
                        setProject(Projects[e.key - 1]);
                    }}
                />
            }
        </Sider>
    )
}

export default ProjectSider