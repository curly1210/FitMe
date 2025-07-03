import { useCustom } from "@refinedev/core";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Spin } from "antd";
import { useMemo, useState } from "react";
import { feature } from "topojson-client";
import { scaleLinear } from "d3-scale";
import topoData from "../../../../assets/map/geoBoundaries-VNM-ADM1.topo.json";

const normalizeProvinceName = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
};
type Props = {
  from: string;
  to: string;
  status_order_id?: number;
};
export const OrderLocationMap = ({ from, to, status_order_id }:Props) => {
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

  const apiData = data?.data || {};

  const normalizedApiData = useMemo(() => {
    const result: Record<string, number> = {};
    Object.entries(apiData).forEach(([province, value]) => {
      result[normalizeProvinceName(province)] = value.order_count;
    });
    return result;
  }, [apiData]);

  const max = Math.max(1, ...Object.values(normalizedApiData));
  const colorScale = scaleLinear<string>()
    .domain([0, max])
    .range(["#E6F0FF", "#003366"]);

  const geoJson = useMemo(() => {
    const objKey = Object.keys(topoData.objects)[0];
    const obj = (topoData.objects as any)[objKey];
    return feature(topoData as any, obj);
  }, []);

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
              const rawShapeName = geo.properties?.shapeName ?? "";
              const normalized = normalizeProvinceName(rawShapeName);
              const orderCount = normalizedApiData[normalized] || 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={orderCount > 0 ? colorScale(orderCount) : "#F5F5F5"}
                  stroke="#AAA"
                  onMouseEnter={(e) => {
                    setTooltipContent(`${rawShapeName}: ${orderCount} đơn hàng`);
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
