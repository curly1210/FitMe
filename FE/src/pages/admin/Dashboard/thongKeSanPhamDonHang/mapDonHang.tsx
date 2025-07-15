import { useCustom } from "@refinedev/core";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Spin } from "antd";
import { useMemo, useState } from "react";
import { feature } from "topojson-client";
import { scaleLinear } from "d3-scale";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import topoData from "../../../../assets/map/geoBoundaries-VNM-ADM1.topo.json";

const normalizeProvinceName = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

type Props = {
  from: string;
  to: string;
  status_order_id?: number;
};

export const OrderLocationMap = ({ from, to, status_order_id }: Props) => {
  const { data, isLoading } = useCustom({
    url: "/admin/statistics/orderLocation",
    method: "get",
    config: {
      query: {
        from,
        to,
        ...(status_order_id !== undefined && { status_order_id }),
      },
    },
  });

//Chuyển dữ liệu bản đồ topoJSON thành GeoJSON(công dụng: Dùng topojson-client để chuyển file topoData thành geoJson có cấu trúc chuẩn để render bản đồ.)
  const geoJson = useMemo(() => {
    const objKey = Object.keys(topoData.objects)[0];
    const obj = (topoData.objects as any)[objKey];
    return feature(topoData as any, obj) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;
  }, []);

  // b1:Chuẩn hóa tên tỉnh từ geoJson để so khớp với dữ liệu từ BE

  const geoNameMap = useMemo(() => {
    const result: Record<string, string> = {};
    geoJson.features.forEach((feature) => {
      const raw = feature.properties?.shapeName ?? "";
      const normalized = normalizeProvinceName(raw);
      result[normalized] = raw;
    });
    //console.log(" geoNameMap (normalizedName -> shapeName):", result);
    return result;
  }, [geoJson]);

  // B2: Chuẩn hóa dữ liệu từ BE để khớp với geoJson
  const normalizedApiData = useMemo(() => {
    const raw = data?.data?.data || {};
    const result: Record<string, number> = {};
    Object.entries(raw).forEach(([province, value]) => {
        if (!(value as any)?.order_count) return;
      const normalized = normalizeProvinceName(province);
      const shapeName = geoNameMap[normalized];
      if (shapeName) {
        result[shapeName] = (value as any).order_count || 0;
      }else {
    //console.warn(" Không khớp tên tỉnh từ BE:", province, "→ normalized:", normalized);
  }
    });
   
    return result;
  }, [data, geoNameMap]);
  
// tính màu theo đơn hàng: nhiều đơn thì đậm
  const max = Math.max(1, ...Object.values(normalizedApiData));
  const colorScale = scaleLinear<string>()
    .domain([0, max])
    .range(["#E6F0FF", "#003366"]);

  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  if (isLoading) return <Spin />;

  return (
    <div style={{ position: "relative" }}>
      <ComposableMap
        projection="geoMercator"
        width={1000}
        height={800}
        projectionConfig={{ scale: 2800, center: [105.5, 16] }}
        onMouseLeave={() => setTooltipContent(null)}
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
  );
};
