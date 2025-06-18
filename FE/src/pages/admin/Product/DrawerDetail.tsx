import { Drawer, Button, Skeleton } from "antd";
import { useOne } from "@refinedev/core";

interface DrawerDetailProps {
  open: boolean;
  onClose: () => void;
  productId: number | null;
}

const DrawerDetail: React.FC<DrawerDetailProps> = ({ open, onClose, productId }) => {
  const { data, isLoading } = useOne({
    resource: `admin/products/${productId}/comments`, // ✅ dùng đúng route mới
    id: "", // ⚠️ bắt buộc phải có, nhưng route không dùng nên để ""
    queryOptions: {
      enabled: !!productId && open,
    },
  });

  const product = data?.data;

  return (
    <Drawer
      title="Chi tiết sản phẩm"
      placement="right"
      width={600}
      onClose={onClose}
      open={open}
      footer={
        <div className="text-right">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      }
    >
      {isLoading || !product ? (
        <Skeleton active />
      ) : (
        <div className="space-y-5">
          <div className="flex gap-4 items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-32 h-32 object-cover rounded border"
            />
            <div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-500">{product.description}</p>
              <p className="text-green-600 font-bold text-lg">
                {Number(product.price || 0).toLocaleString()}₫
              </p>
              <p className="text-sm text-gray-600">
                Tồn kho: {product.total_inventory}
              </p>
              <p className="text-sm text-gray-600">
                Trạng thái:{" "}
                <span
                  className={
                    product.is_active ? "text-green-600" : "text-red-500"
                  }
                >
                  {product.is_active ? "Hiển thị" : "Đang ẩn"}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Bình luận:</h3>
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
              {product.comments?.length > 0 ? (
                product.comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="rounded p-3 bg-gray-50 border"
                  >
                    <p className="font-medium text-sm">
                      {comment.user?.name ?? "Ẩn danh"}
                    </p>
                    <p>{comment.content}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Chưa có bình luận nào.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default DrawerDetail;
