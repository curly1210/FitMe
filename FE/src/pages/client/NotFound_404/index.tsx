import { Link } from "react-router";

interface NotFound404Props {
  message?: string;
  fullscreen?: boolean;
}

const NotFound_404 = ({
  message = "Đường dẫn bạn đang tìm kiếm không có hoặc đã bị xóa.",
  fullscreen = true,
}: NotFound404Props) => {
  return (
    <div
      className={`${
        fullscreen ? "min-h-screen" : "h-[400px]"
      } bg-white flex flex-col items-center justify-center text-center px-6`}
    >
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mt-4">
        Oops! Trang không tồn tại
      </h2>
      <p className="text-gray-500 mt-2 mb-6">{message}</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFound_404;
