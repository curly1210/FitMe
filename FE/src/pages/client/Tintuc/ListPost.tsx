/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useList } from "@refinedev/core";
import { Link } from "react-router";
import { Spin } from "antd";
import dayjs from "dayjs"; // ✅ Thêm thư viện xử lý ngày

// ✅ Hàm loại bỏ thẻ HTML trong content
const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const ListPost = () => {
  const { data, isLoading } = useList({
    resource: "client/posts",
  });

  const newsList = data?.data ?? [];

  return (
    <div className="mt-6 pb-8 border-b border-gray-200">
      <h2 className="text-xl font-bold mb-5">Tin tức</h2>

      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newsList.map((item: any) => (
            <Link
              to={`/post/${item.slug}`}
              key={item.id}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-[9px] cursor-pointer transform transition-transform duration-400 hover:-translate-y-2">
                {/* Ảnh thumbnail */}
                <div className="h-[198px] bg-gray-100 rounded overflow-hidden">
                  <img
                    src={
                      item.thumbnail ||
                      "https://via.placeholder.com/400x225?text=No+Image"
                    }
                    alt={item.title}
                    className="object-cover block h-full w-full"
                    // onError={(e) => {
                    //   (e.target as HTMLImageElement).src =
                    //     "https://via.placeholder.com/400x225?text=Image+Error";
                    // }}
                  />
                </div>

                {/* Ngày tạo */}
                   {/* Created at */}
                   <p className="text-center text-gray-500 mb-4">
                     {dayjs(item.created_at, "DD-MM-YYYY HH:mm:ss").isValid()
                       ? dayjs(item.created_at, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")
                       : "Không rõ ngày"}
                   </p>

                {/* Tiêu đề */}
                <p className="line-clamp-2 font-semibold text-ellipsis text-justify leading-5">
                  {item.title}
                </p>

                {/* Nội dung rút gọn */}
                <p className="line-clamp-2 text-[#8C8C8C] text-sm text-ellipsis text-justify leading-5">
                  {stripHtml(item.content)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListPost;
