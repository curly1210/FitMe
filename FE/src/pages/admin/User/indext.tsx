import { useList, useUpdate } from "@refinedev/core";
import { Dropdown, Menu, Table } from "antd";
import { useState } from "react";
import Detail from "./detail";

const User = () => {
    //phân item page
    const [current, setCurrent] = useState(1);
     const [pageSize, setPageSize] = useState(10);
    //draw
     const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
     
    const {mutate}=useUpdate();
    const { data, isLoading } = useList({
        resource: "admin/users",
        pagination: {
            current,
            pageSize ,
        },
         hasPagination: true,
        meta: {
            pagination: {
                current: "data.meta.current_page",
                pageSize: "data.meta.per_page",
                total: "data.meta.total",
            },
        },
    });

     

    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Ngày sinh", dataIndex: "birthday", key: "birthday" },
        { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
        { title: "Giới tính", dataIndex: "gender", key: "gender" },
        { title: "Trạng thái", dataIndex: "is_ban", key: "is_ban", 
            render: (value: number) => {
            if (value === 0) {
                return <span style={{ color: "green" }}>Hoạt động</span>;
            }
            if (value === 1) {
                return <span style={{ color: "red" }}>Khóa</span>;
            }
            return <span>Không xác định</span>;

           
       
        },
     }, {
        render: (_: any, record:any) => {
              
            
            //hàm sử lý thay đổi trạng thái
            const hanlToggleBan=()=>{
                mutate(
        {
            resource: "admin/users/lock",
            id: record.id,
            values: {
                is_ban: record.is_ban === 0 ? 1 : 0,
            },
            successNotification: () => ({
                message: "Cập nhật thành công",
                description: `Người dùng đã được ${record.is_ban === 0 ? "khóa" : "mở khóa"}`,
                type: "success",
            }),
        },
        {
            onSuccess: () => {
              
                window.location.reload();
            },
        }
    );  
            }


            const menu = (
                <Menu>
                    <Menu.Item key="detail" onClick={() =>{setSelectedRecord(record); setDrawerOpen(true);}}>
                        Chi tiết
                    </Menu.Item>
                    <Menu.Item key="toggle_ban" onClick={hanlToggleBan }>
                      {record.is_ban === 0 ? "Khóa" : "Mở khóa"}
                    </Menu.Item>
                </Menu>
                
            );

            return (
                 <Dropdown overlay={menu} trigger={["click"]}>
                <span style={{ cursor: "pointer", fontSize: 20 }}>⋯</span>
            </Dropdown>
            
            );
        },
    },

    ];

    return (
        <>
        <Table
        className="border-gray rounded-2xl"
            dataSource={data?.data ?? []}
            columns={columns}
            loading={isLoading}
            rowKey="id"
            //phân trang
            pagination={{
                current: current,
                pageSize: pageSize,
                total: data?.data?.meta?.total ?? 0,
                showSizeChanger: true,
                onChange: (page,size) => {
                    setCurrent(page);
                     setPageSize(size);
                },
            }}
        />
        
            <Detail
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                record={selectedRecord}
            />
            </>
    );
        
};

export default User;
