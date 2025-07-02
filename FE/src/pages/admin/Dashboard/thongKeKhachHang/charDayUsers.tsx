import { Bar } from "react-chartjs-2";
import { Button, Card, Empty, Space } from "antd";

const RevenueByRecent = ({
  range,
  setRange,
  recentArray,
}: {
  range: 7 | 14 | 30;
  setRange: (val: 7 | 14 | 30) => void;
  recentArray: Array<Record<string, number>>;
}) => {
 
  const indexMap = { 7: 0, 14: 1, 30: 2 };
  const recent = recentArray?.[indexMap[range]] || {};

  const labels = Object.keys(recent);
  const values = Object.values(recent);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${range} ngày gần nhất`,
        data: values,
        backgroundColor: "#3b82f6",
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Card
      title={`Biểu đồ ${range} ngày gần nhất`}
      style={{ marginBottom: 24, borderRadius: 10 }}
      bodyStyle={{ paddingBottom: 24 }}
    >
      <Space style={{ marginBottom: 12 }}>
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

      {values.length > 0 ? (
        <div style={{ height: 300 }}>
         <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <Empty description="Không có dữ liệu" />
      )}
    </Card>
  );
};

export default RevenueByRecent;
