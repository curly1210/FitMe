import { Bar } from "react-chartjs-2";
import { Card } from "antd";

const RevenueByMonth = ({
  month,
  year,
  data,
}: {
  month: number;
  year: number;
  data: Record<string, number>;
}) => {
  const chartData = {
    labels: Object.keys(data || {}),
    datasets: [
      {
        label: `Tháng ${month}/${year}`,
        data: Object.values(data || {}),
        backgroundColor: "#10b981",
      },
    ],
  };

  return (
    <Card
      title={`Biểu đồ khách hàng trong tháng ${month}/${year}`}
      style={{ borderRadius: 10 }}
    >
      <Bar data={chartData} options={{ responsive: true }} />
    </Card>
  );
};

export default RevenueByMonth;
