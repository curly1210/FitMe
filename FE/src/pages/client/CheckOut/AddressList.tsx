import {
  Button,
  Modal,
  Radio,
  Typography,
  Spin,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import ModalAddress from "../../../components/Modal/ModalAddress";
import { useList } from "@refinedev/core";

const { Title, Text } = Typography;

interface AddressListProps {
  onSelect: (address: any) => void;
  selectedAddressId: string | null;
  open?: boolean;
  onClose?: () => void;
  isModal?: boolean;
  defaultMode?: "create" | "list";
}

const AddressList = ({ onSelect, selectedAddressId ,defaultMode}: AddressListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  const { data, isLoading, refetch } = useList({
    resource: "addresses",
    pagination: { mode: "off" },
  });
  

  const addresses = data?.data || [];

  const openModal = (mode: "create" | "edit", record?: any) => {
    setModalMode(mode);
    setCurrentRecord(record || null);
    setIsModalOpen(true);
  };
  
  useEffect(() => {
  if (defaultMode === "create") {
    openModal("create");
  }
}, [defaultMode]);

  return (
    <div className="p-4 pr-5">
      <Title level={4} className="text-center mb-4">
        Chọn địa chỉ
      </Title>

      {isLoading ? (
        <Spin />
      ) : (
        <Radio.Group
          onChange={(e) => {
            const selected = addresses.find((a: any) => a.id === e.target.value);
            if (selected) {
              onSelect(selected);
            }
          }}
          value={selectedAddressId}
          className="flex flex-col gap-3"
        >
          {addresses.map((addr: any) => (
            <div key={addr.id} className="p-3 relative rounded-sm bg-white w-full">
              <div className="flex justify-between items-start gap-4 w-full">
                <Radio value={addr.id} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text>
                      {addr.name_receive} | {addr.phone} 
                    </Text>
                    {addr.is_default && (
                      <span className="bg-black text-white text-xs px-2 py-1">Mặc định</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {addr.full_address}
                  </div>
                </div>

             
                </div>
                   <div className="absolute top-3 left-150">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => openModal("edit", addr)}
                  />
              </div>
            </div>
          ))}
        </Radio.Group>
      )}

      <div className="mt-4">
        <Button type="link" icon={<PlusOutlined />} onClick={() => openModal("create")}>
          Thêm địa chỉ
        </Button>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
     
      >
        <ModalAddress
         showCloseIcon={false}
          mode={modalMode}
          record={currentRecord}
          refetch={() => {
            refetch();
            setIsModalOpen(false);
          }}
           totalAddresses={addresses.length}
        />
      </Modal>
    </div>
  );
};

export default AddressList;
