import { Card, Table } from "antd";

const TopCustomersTable = ({
  customers,
}: {
  customers: {
    id: number;
    name: string;
    email: string;
    total_spent: string;
  }[];
}) => {
  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Tổng chi tiêu",
      dataIndex: "total_spent",
      key: "total_spent",
      render: (val: string) => `${Number(val).toLocaleString()} VNĐ`,
    },
  ];

  return (
    <Card
      title="Top khách hàng chi tiêu"
      style={{ marginTop: 24, borderRadius: 10 }}
      bodyStyle={{ padding: 0 }}
    >
      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
};

export default TopCustomersTable;
