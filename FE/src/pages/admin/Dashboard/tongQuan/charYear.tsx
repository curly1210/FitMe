import { useCustom } from "@refinedev/core";
import { Bar } from "react-chartjs-2";
import { Select, Spin } from "antd";
import { useState } from "react";

const years = [2025, 2024];

const ChartByYear = () => {
  const [year, setYear] = useState<number>(2024);

  const { data, isLoading } = useCustom({
    url: "/admin/statistics",
    method: "get",
    config: {
      query: {
        year,
      },
    },
  });

  const yearly = data?.data?.yearly;
  const yearlyData = yearly?.data || {};

  const chartData = {
    labels: Object.keys(yearlyData).map((m) => `Tháng ${m}`),
    datasets: [
      {
        label: `Năm ${year}`,
        data: Object.values(yearlyData).map(Number),
        backgroundColor: "#fbbf24",
      },
    ],
  };

  return (
    <>
      {/*lọc*/}
      <Select
        value={year}
        onChange={(val) => setYear(val)}
        style={{ width: 120, marginBottom: 16 }}
        className="!h-8 [&_.ant-select-selector]:!h-8"
      >
        {years.map((y) => (
          <Select.Option key={y} value={y}>
            {y}
          </Select.Option>
        ))}
      </Select>

      {yearly?.total && (
        <p style={{ margin: "12px 0", fontWeight: "bold" }}>
          Tổng doanh thu: {yearly.total.toLocaleString("vi-VN")} VNĐ
        </p>
      )}

      {isLoading ? (
        <Spin />
      ) : (
        <Bar data={chartData} options={{ responsive: true }} />
      )}
    </>
  );
};

export default ChartByYear;
