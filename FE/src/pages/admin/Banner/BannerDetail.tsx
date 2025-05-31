import React, { useState } from "react";
import { useOne } from "@refinedev/core";
import { Drawer, Spin, Typography, Image, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { FRONTEND_BASE_URL } from "../../../utils/constant";


const { Paragraph, Link } = Typography;

type Banner = {
  id: number;
  title: string;
  direct_link: string;
  updated_at: string;
  url_image: string;
  content?: string;
};

type Props = {
  bannerId: number | null;
  visible: boolean;
  onClose: () => void;
};

const BannerDetailDrawer: React.FC<Props> = ({ bannerId, visible, onClose }) => {
  const { data, isLoading, isError } = useOne<Banner>({
    resource: "banners",
    id: bannerId ?? 0,
    queryOptions: { enabled: bannerId !== null },
  });

  const [previewVisible, setPreviewVisible] = useState(false);

  const buildFrontendLink = (link: string) => {
    return link === "#" ? "#" : `${FRONTEND_BASE_URL}${link}`;
  };

  return (
    <Drawer title="Chi tiết Banner" placement="right" onClose={onClose} open={visible} width={500}>
      {isLoading ? (
        <Spin />
      ) : isError || !data ? (
        <p>Không thể tải dữ liệu.</p>
      ) : (
        <>
          <Paragraph>
            <strong>Tiêu đề:</strong> {data.data.title}
          </Paragraph>
          <Paragraph>
            <strong>Liên kết:</strong>{" "}
            {data.data.direct_link === "#" ? (
              <span>Không liên kết</span>
            ) : (
              <Link
                href={buildFrontendLink(data.data.direct_link)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {buildFrontendLink(data.data.direct_link)}
              </Link>
            )}
          </Paragraph>
          <Paragraph>
            <strong>Ngày cập nhật:</strong>{" "}
            {new Date(data.data.updated_at).toLocaleString()}
          </Paragraph>

          <div
            style={{
              position: "relative",
              width: "100%",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            <Image
              src={data.data.url_image}
              alt={data.data.title}
              width="100%"
              style={{ maxHeight: 250, objectFit: "contain" }}
              preview={{
                visible: previewVisible,
                onVisibleChange: (vis) => setPreviewVisible(vis),
              }}
            />

            <div
              className="preview-button"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0,
                transition: "0.3s",
              }}
            >
              <Button
                icon={<EyeOutlined />}
                type="primary"
                ghost
                onClick={() => setPreviewVisible(true)}
              >
                Preview
              </Button>
            </div>

            <style>
              {`
                .preview-button {
                  pointer-events: none;
                }

                div:hover .preview-button {
                  opacity: 1;
                  pointer-events: auto;
                }
              `}
            </style>
          </div>
        </>
      )}
    </Drawer>
  );
};

export default BannerDetailDrawer;
