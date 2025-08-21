/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useList } from "@refinedev/core";
import { Link } from "react-router";
import { Spin, Pagination } from "antd";
import dayjs from "dayjs";
import ImageWithFallback from "../../../components/ImageFallBack";

const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const ListPost = () => {
  const [current, setCurrent] = useState(1);
  const pageSize = 10; 

  const { data, isLoading } = useList({
    resource: "client/posts",
    pagination: {
      current,
      pageSize,
    },
  });

  const newsList = data?.data ?? [];
  const total = data?.total ?? 0;

  // Scroll lên đầu khi đổi trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  return (
    <div className="mt-6 pb-8 border-b border-gray-200">
      <h2 className="text-xl font-bold mb-5">Tin tức</h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Danh sách bài viết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newsList.map((item: any) => (
              <Link to={`/post/${item.slug}`} key={item.id}>
                <div className="flex flex-col gap-[9px] cursor-pointer transform transition-transform duration-400 hover:-translate-y-2">
                  <div className="h-[198px] bg-gray-100 rounded overflow-hidden">
                    <ImageWithFallback
                      src={item.thumbnail}
                      alt={item.title}
                      width={"100%"}
                      height={"100%"}
                    />
                  </div>

                  <p className="text-center text-gray-500 mb-4">
                    {dayjs(item.created_at, "DD-MM-YYYY HH:mm:ss").isValid()
                      ? dayjs(item.created_at, "DD-MM-YYYY HH:mm:ss").format(
                          "DD/MM/YYYY HH:mm:ss"
                        )
                      : "Không rõ ngày"}
                  </p>

                  <p className="line-clamp-2 font-semibold text-ellipsis text-justify leading-5">
                    {item.title}
                  </p>

                  <p className="line-clamp-2 text-[#8C8C8C] text-sm text-ellipsis text-justify leading-5">
                    {stripHtml(item.content)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* ✅ Luôn hiển thị phân trang */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={(page) => setCurrent(page)}
              showSizeChanger={false}
              // ✅ Nếu total <= pageSize, chỉ có nút "1", không có nút "2"
              hideOnSinglePage={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ListPost;
