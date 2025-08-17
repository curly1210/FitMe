import { useCustom } from "@refinedev/core";
import { Spin, message } from "antd";
import { Link, useParams } from "react-router";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat); // ✅ Kích hoạt hỗ trợ định dạng tùy chỉnh

// ✅ Kiểu dữ liệu bài viết
interface Post {
  id: number;
  title: string;
  slug: string;
  thumbnail?: string;
  created_at: string;
  content: string;
  related_posts?: Post[];
}

const PostDetail = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useCustom<Post>({
    url: `/client/posts/${slug}`,
    method: "get",
  });

  const post = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !post) {
    message.error("Bài viết không tồn tại hoặc có lỗi xảy ra");
    return (
      <div className="text-center text-red-500 mt-10">
        Không tìm thấy bài viết hoặc đã bị xoá.
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto py-10 px-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/" className="text-blue-500">
          Trang chủ
        </Link>{" "}
        {">"}{" "}
        <Link to="/tin-tuc" className="text-blue-500">
          Tin tức
        </Link>{" "}
        {">"} <span className="font-semibold text-black">{post.title}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-center uppercase mb-2">
        {post.title}
      </h1>

      {/* Created at */}
      <p className="text-center text-gray-500 mb-4">
        {dayjs(post.created_at, "DD-MM-YYYY HH:mm:ss").isValid()
          ? dayjs(post.created_at, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY")
          : "Không rõ ngày"}
      </p>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="rounded-xl overflow-hidden shadow-xl mb-10">
          {/* <ImageWithFallback
            src={post.thumbnail}
            alt={post.title}
            width={"100%"}
            height={"100%"}
          /> */}
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-sm sm:prose-base max-w-none text-justify"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Related Posts */}
      {Array.isArray(post.related_posts) && post.related_posts.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-6 text-center uppercase">
            CÁC BÀI VIẾT LIÊN QUAN
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {post.related_posts
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .slice(0, 3)
              .map((related) => (
                <Link
                  to={`/post/${related.slug}`}
                  key={related.id}
                  className="bg-white rounded-lg overflow-hidden shadow block"
                >
                  <div className="relative aspect-[16/9] bg-gray-100">
                    <img
                      src={related.thumbnail}
                      className="w-full h-full object-cover"
                    />
                    <div className="">{related.title}</div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">Tin tức</p>
                    <h3 className="font-semibold text-sm">{related.title}</h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
