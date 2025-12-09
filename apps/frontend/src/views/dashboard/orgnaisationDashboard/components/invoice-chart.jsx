import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function InvoiceChart({
  title,
  stats = [],
  dataKey = "invoiceCount",
}) {
  const data = (stats || []).map((item) => ({
    name: item.month,
    value: item[dataKey] ?? 0,
  }));

  const yAxisFormatter = (value) => {
    if (value >= 1000000) return value / 1000000 + "M";
    if (value >= 1000) return value / 1000 + "K";
    return value;
  };

  return (
    <div className="d-flex flex-column gap-4">
      <p className="fs-5">{title}</p>
      <div style={{ height: "271px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: -30,
              bottom: -5,
            }}
          >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={60} // Increase width to prevent label cutoff
              tickFormatter={yAxisFormatter}
            />
            <Tooltip formatter={(value) => value} />
            <Bar
              dataKey="value"
              barSize={17}
              fill="#0040a3"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
