import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const FooterClient = () => {
  return (
    <div className="w-7xl mx-auto px-4 mt-24 mb-24">
      <div className="mb-6">
        <img
          width={138}
          src="https://media.routine.vn/0x0/prod/media/52ba65a3-e085-45a6-bf5e-fb9c359abff7.webp"
          alt=""
        />
      </div>
      <div className="flex items-start gap-10">
        <div className="flex-[1.5] flex flex-col gap-4 font-semibold">
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-xl" />
            <p>
              Địa chỉ: Tầng 1, Tòa nhà Rivera Park, số 69 Vũ Trọng Phụng, Phường
              Thanh Xuân Trung
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-xl" />
            <p>Tel: 0898645587</p>
          </div>
          <div className="flex items-center gap-2">
            <MailOutlined className="text-xl" />
            <p>Email: fitme@gmail.com</p>
          </div>
          <div className="flex gap-2">
            <img
              width={32}
              src="https://cdn-icons-png.flaticon.com/512/15047/15047435.png"
              alt=""
            />
            <img
              width={32}
              src="https://cdn-icons-png.flaticon.com/512/15707/15707749.png"
              alt=""
            />
            <img
              width={32}
              src="https://cdn-icons-png.flaticon.com/512/3116/3116491.png"
              alt=""
            />
          </div>
        </div>
        <div className="flex-[1] flex flex-col gap-4">
          <h2 className="font-semibold">VỀ FITME</h2>
          <p>Giới thiệu về Fitme</p>
          <p>Tầm nhìn - sứ mệnh</p>
          <p>Đội ngũ nhân viên</p>
        </div>
        <div className="flex-[1] flex flex-col gap-4">
          <h2 className="font-semibold">CHÍNH SÁCH</h2>
          <p>Hình thức thanh toán</p>
          <p>Trả hàng & hoàn tiền</p>
          <p>Chính sách bảo mật</p>
        </div>
        <div className="flex-[1] flex flex-col gap-4">
          <h2 className="font-semibold">HƯỚNG DẪN MUA SẮM</h2>
          <p>Hường dẫn mua online</p>
          <p>Hướng dẫn kiểm tra hạng mamber</p>
          <p>Hướng dẫn đổi điểm tích lũy</p>
        </div>
      </div>
    </div>
  );
};
export default FooterClient;
