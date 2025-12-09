import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const defaultRiskByStatus = {
  open: {
    risks: [0, 0, 0, 0, 0, 0],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  mitigated: {
    risks: [0, 0, 0, 0, 0, 0],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  accepted: {
    risks: [0, 0, 0, 0, 0, 0],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
  escalated: {
    risks: [0, 0, 0, 0, 0, 0],
    months: ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN"],
  },
};

export default function StatusVsChart({ riskByStatus = defaultRiskByStatus }) {
  // Build data array for recharts
  const months = riskByStatus.open.months;
  const data = months.map((name, i) => ({
    name,
    open: riskByStatus.open.risks[i] ?? 0,
    mitigated: riskByStatus.mitigated.risks[i] ?? 0,
    accepted: riskByStatus.accepted.risks[i] ?? 0,
    escalated: riskByStatus.escalated.risks[i] ?? 0,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          width={500}
          height={250}
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
            <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6900BF" stopOpacity={0.75} />
              <stop offset="100%" stopColor="#FFFFFF00" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0040A3" stopOpacity={0.75} />
              <stop offset="100%" stopColor="#FFFFFF00" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorEscalated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ED3447" stopOpacity={0.75} />
              <stop offset="100%" stopColor="#FFFFFF00" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMitigated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#28A745" stopOpacity={0.75} />
              <stop offset="100%" stopColor="#FFFFFF00" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            padding={{ left: 40, right: 40 }}
            dataKey="name"
            axisLine={false}
            tickLine={false}
          />
          <YAxis axisLine={false} tickLine={false} />
          {/* <Tooltip /> */}
          <Area
            type="monotone"
            dataKey="open"
            dot={{ r: 2, stroke: "#FF6900", fill: "#FF6900" }}
            stroke="#FF6900"
            fill="url(#colorOpen)"
          />
          <Area
            type="monotone"
            dataKey="accepted"
            dot={{ r: 2, stroke: "#0040A3", fill: "#0040A3" }}
            stroke="#0040A3"
            fill="url(#colorAccepted)"
          />
          <Area
            type="monotone"
            dataKey="escalated"
            dot={{ r: 2, stroke: "#ED3447", fill: "#ED3447" }}
            stroke="#ED3447"
            fill="url(#colorEscalated)"
          />
          <Area
            type="monotone"
            dataKey="mitigated"
            dot={{ r: 2, stroke: "#28A745", fill: "#28A745" }}
            stroke="#28A745"
            fill="url(#colorMitigated)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
