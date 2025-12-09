import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const defaultData = [
  { name: "Jan", pv: 0 },
  { name: "Feb", pv: 0 },
  { name: "Mar", pv: 8 },
  { name: "Apr", pv: 0 },
  { name: "May", pv: 0 },

  { name: "Oct", pv: 0 },
  { name: "Nov", pv: 8 },
  { name: "Dec", pv: 1 },
];

export default function BusinessUnitsChart({ data = defaultData }) {
  // Calculate dynamic Y axis domain and ticks
  const values = data.map((d) => d.pv ?? 0);
  const max = Math.max(1, ...values); // at least 1 so axis is visible
  const min = Math.min(0, ...values);
  // Generate ticks: from min to max, step 1 if max <= 10, else step = Math.ceil(max/5)
  let step = 1;
  if (max > 10) step = Math.ceil(max / 5);
  const ticks = [];
  for (let t = min; t <= max; t += step) {
    ticks.push(t);
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={274}>
        <AreaChart
          width={500}
          height={274}
          data={data}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: -40,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              {/* Top color - more opaque */}
              <stop offset="0%" stopColor="#BBDCFDBF" stopOpacity={0.75} />
              {/* Bottom color - transparent */}
              <stop offset="100%" stopColor="#FFFFFF00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="1 1"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            padding={{ left: 40, right: 40 }}
            dataKey="name"
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            domain={[min, max]}
            ticks={ticks}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value) => [value, "Risks"]} />
          <Area
            type="monotone"
            dataKey="pv"
            dot={{ r: 2, stroke: "#0040A3", fill: "#0040A3" }}
            stroke="#0040A3"
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
