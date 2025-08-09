import { useEffect, useState } from "react";
import { Button, Form, Input, Spin, Result } from "antd";
import login from "../../assets/images/login.png";
import { LockOutlined } from "@ant-design/icons";
import { useModal } from "../../hooks/useModal";
import { useCreate, useCustom } from "@refinedev/core";
import { usePopupMessage } from "../../hooks/usePopupMessage";
import { useLocation, useNavigate } from "react-router";
import ModalLogin from "./ModalLogin";

const ModalChangePass = () => {
  const { notify } = usePopupMessage();
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const [userId, setUserId] = useState<string | null>(null);
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token") || "";

  // verify token khi load
  const { refetch: verifyToken } = useCustom({
    url: `/password/verify`,
    method: "get",
    config: {
      query: { token },
    },
    queryOptions: {
      enabled: false,
      onSuccess: (res: any) => {
        if (res?.data?.valid) {
          setValid(true);
          setUserId(res.data.user_id);
        } else {
          setValid(false);
        }
        setValidating(false);
      },
      onError: () => {
        setValid(false);
        setValidating(false);
      },
    },
  });

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setValid(false);
      setValidating(false);
    }
  }, [token]);

  const { mutate, isLoading } = useCreate({
    resource: "password/reset",
    mutationOptions: {
      onSuccess: (response) => {
        notify(
          "success",
          "Đổi mật khẩu",
          response?.data?.message || "Thành công"
        );
        // Quay về trang trước hoặc trang bạn muốn
        navigate(-1);
        // Mở modal đăng nhập
        openModal(<ModalLogin />);
      },
      onError: (error) => {
        notify(
          "error",
          "Đổi mật khẩu",
          error?.response?.data?.message || "Thất bại"
        );
      },
    },
  });

  const onFinish = (values: any) => {
    if (!userId) {
      notify("error", "Lỗi", "Không tìm thấy user_id, vui lòng thử lại");
      return;
    }
    mutate({
      values: {
        user_id: userId,
        password: values.password,
        password_confirmation: values.confirmPassword,
        token,
      },
    });
  };

  // Nút đóng => quay về trang trước
  const onClose = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  if (validating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Spin size="large" tip="Đang xác thực..." />
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Result
          status="error"
          title="Liên kết không hợp lệ hoặc đã hết hạn"
          subTitle="Vui lòng yêu cầu gửi lại email đổi mật khẩu."
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[800px] gap-x-10 grid grid-cols-2 bg-white rounded-2xl shadow-lg p-10 relative">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-black cursor-pointer select-none text-3xl font-bold leading-none"
        >
          ×
        </button>

        <div className="flex justify-center items-center">
          <img src={login} height={200} alt="" />
        </div>

        <div>
          <div className="pb-6 mb-6 border-b border-b-gray-200">
            <p className="text-3xl font-semibold text-center mb-2">
              Nhập mật khẩu mới
            </p>
            <p className="text-sm text-[#4B5563] text-center">
              Vui lòng nhập mật khẩu mới và xác nhận lại
            </p>
          </div>

          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Mật khẩu mới"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
              ]}
              className="!mb-5"
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới"
                prefix={<LockOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>

            <Form.Item
              label="Nhập lại mật khẩu mới"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu nhập lại không khớp")
                    );
                  },
                }),
              ]}
              className="!mb-5"
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu mới"
                prefix={<LockOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>

            <Button
              loading={isLoading}
              className="w-full !bg-[#22689B] !text-base !py-5 !rounded-3xl"
              type="primary"
              htmlType="submit"
            >
              Thay đổi mật khẩu
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ModalChangePass;
