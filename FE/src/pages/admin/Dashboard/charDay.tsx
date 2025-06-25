import { useCustom } from "@refinedev/core";
import { Bar } from "react-chartjs-2";
import { Button, Space, Spin } from "antd";
import { useState } from "react";

const ChartLastDays = () => {
  const [range, setRange] = useState<7 | 14 | 30>(7);

  const { data, isLoading } = useCustom({
    url: "/admin/statistics",
    method: "get",
  });

  const recent = data?.data?.recent?.[range]; //  Gộp total + data
  const recentData = recent?.data || {};

  const chartData = {
    labels: Object.keys(recentData).map((k) => `Ngày ${k}`),
    datasets: [
      {
        label: `${range} ngày gần nhất`,
        data: Object.values(recentData).map(Number),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  return (
    <>
    {/*lọc*/}
      <Space style={{ marginBottom: 16 }}>
        {[7, 14, 30].map((val) => (
          <Button
            key={val}
            onClick={() => setRange(val as 7 | 14 | 30)}
            type={range === val ? "primary" : "default"}
          >
            {val} ngày
          </Button>
        ))}
      </Space>

      {recent?.total && (
        <p style={{ margin: "12px 0", fontWeight: "bold" }}>
          Tổng doanh thu: {recent.total.toLocaleString("vi-VN")} VNĐ
        </p>
      )}

      {isLoading ? <Spin /> : <Bar data={chartData} options={{ responsive: true }} />}
    </>
  );
};

export default ChartLastDays;
