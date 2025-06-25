import { useCustom } from "@refinedev/core";
import { Bar } from "react-chartjs-2";
import { DatePicker, Spin } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const ChartByMonth = () => {
  const [month, setMonth] = useState(dayjs());

  const { data, isLoading } = useCustom({
    url: "/admin/statistics",
    method: "get",
    config: {
      query: {
        year: month.year(),
        month: month.month() + 1,
      },
    },
  });

  const monthly = data?.data?.monthly;
  const monthlyData = monthly?.data || {};

  const chartData = {
    labels: Object.keys(monthlyData).map((d) => `Ngày ${d}`),
    datasets: [
      {
        label: `Tháng ${month.month() + 1}/${month.year()}`,
        data: Object.values(monthlyData).map(Number),
        backgroundColor: "#34d399",
      },
    ],
  };

  return (
    <>
      {/*lọc*/}
      <DatePicker
        picker="month"
        value={month}
        onChange={(val) => val && setMonth(val)}
        style={{ marginBottom: 16 }}
      />

      {monthly?.total && (
        <p style={{ margin: "12px 0", fontWeight: "bold" }}>
          Tổng doanh thu: {monthly.total.toLocaleString("vi-VN")} VNĐ
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

export default ChartByMonth;
