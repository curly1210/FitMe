// pages/statistics/chartSetup.ts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký scale và components dùng chung cho Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
