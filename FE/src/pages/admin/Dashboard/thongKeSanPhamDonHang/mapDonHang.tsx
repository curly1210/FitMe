import { useCustom } from "@refinedev/core";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Spin, DatePicker, Select, Row, Col, Space, Typography } from "antd";
import { useMemo, useState } from "react";
import { feature } from "topojson-client";
import { scaleLinear } from "d3-scale";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import topoData from "../../../../assets/map/geoBoundaries-VNM-ADM1.topo.json";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const normalizeProvinceName = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, " ")
    .replace("Tỉnh ", "") // Bỏ tiền tố "Tỉnh"
    .replace("Thành phố ", "") // Bỏ tiền tố "Thành phố"
    .trim()
    .toLowerCase();

export const OrderLocationMap = () => {
  const now = dayjs();
  const [dateRange, setDateRange] = useState<[string, string]>([
    now.subtract(30, "day").format("YYYY-MM-DD"),
    now.format("YYYY-MM-DD"),
  ]);
  const [statusOrderId, setStatusOrderId] = useState<number | undefined>();

  const { data, isLoading } = useCustom({
    url: "/admin/statistics/orderLocation",
    method: "get",
    config: {
      query: {
        from: dateRange[0],
        to: dateRange[1],
        ...(statusOrderId !== undefined && { status_order_id: statusOrderId }),
      },
    },
  });

  const geoJson = useMemo(() => {
    const objKey = Object.keys(topoData.objects)[0];
    const obj = (topoData.objects as any)[objKey];
    return feature(topoData as any, obj) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;
  }, []);

  const geoNameMap = useMemo(() => {
    const result: Record<string, string> = {};
    geoJson.features.forEach((feature) => {
      const raw = feature.properties?.shapeName ?? "";
      const normalized = normalizeProvinceName(raw);
      result[normalized] = raw;
    });
    return result;
  }, [geoJson]);

  const normalizedApiData = useMemo(() => {
    const raw = data?.data?.data || {};
    const result: Record<string, number> = {};
    Object.entries(raw).forEach(([province, value]) => {
      if (!(value as any)?.order_count) return;
      const normalized = normalizeProvinceName(province);
      const shapeName = geoNameMap[normalized];
      if (shapeName) {
        result[shapeName] = (value as any).order_count || 0;
      }
    });
    return result;
  }, [data, geoNameMap]);

  const max = Math.max(1, ...Object.values(normalizedApiData));
  const colorScale = scaleLinear<string>()
    .domain([0, max])
    .range(["#E6F0FF", "#003366"]);

  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

console.log("Số đơn hàng theo tỉnh:", normalizedApiData);
console.log("Raw API data:", data?.data?.data);
console.log("Địa danh trên bản đồ:", geoNameMap.properties);

  if (isLoading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}className="ml-90">
        {/* <Col>
          <Title level={4}>Bản đồ thống kê đơn hàng</Title>
        </Col> */}
        <Col>
          <Space>
            <RangePicker
              allowClear={true}
              value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
              onChange={(dates) => {
                if (dates) {
                  setDateRange([
                    dates[0]?.format("YYYY-MM-DD") ?? "",
                    dates[1]?.format("YYYY-MM-DD") ?? "",
                  ]);
                }
              }}
            />
            <Select
              allowClear
              style={{ width: 180 }}
              placeholder="Trạng thái đơn hàng"
              onChange={(value) => setStatusOrderId(value)}
            >
              <Select.Option value={1}>Chờ xác nhận</Select.Option>
              <Select.Option value={2}>Đang chuẩn bị hàng</Select.Option>
              <Select.Option value={3}>Đang giao hàng</Select.Option>
              <Select.Option value={4}>Đã giao hàng</Select.Option>
              <Select.Option value={5}>Giao hàng thất bại</Select.Option>
              <Select.Option value={6}>Hoàn thành</Select.Option>
              <Select.Option value={7}>Đã huỷ</Select.Option>
            </Select>
          </Space>
        </Col>
      </Row>

      <div style={{ position: "relative" }}>
        <ComposableMap
          projection="geoMercator"
          width={1000}
          height={800}
          projectionConfig={{ scale: 2800, center: [105.5, 16] }}
          onMouseLeave={() => setTooltipContent(null)}
        >
            <ZoomableGroup
    zoom={1}
    maxZoom={20}
    minZoom={1}
    center={[105.5, 16]}
  >
          <Geographies geography={geoJson}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const shapeName = geo.properties?.shapeName ?? "";
                const orderCount = normalizedApiData[shapeName] || 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={orderCount > 0 ? colorScale(orderCount) : "#F5F5F5"}
                    stroke="#AAA"
                    onMouseEnter={(e) => {
                      setTooltipContent(`${shapeName}: ${orderCount} đơn hàng`);
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#FF9933", outline: "none" },
                      pressed: { fill: "#E42", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {tooltipContent && tooltipPos && (
          <div
            style={{
              position: "fixed",
              top: tooltipPos.y + 10,
              left: tooltipPos.x + 10,
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: 4,
              pointerEvents: "none",
              fontSize: 14,
              zIndex: 999,
              whiteSpace: "nowrap",
            }}
          >
            {tooltipContent}
          </div>
        )}
      </div>
    </div>
  );
};
