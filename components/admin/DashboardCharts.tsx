'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

interface DashboardChartsProps {
  data: Array<{ date: string; count: number }>
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-5">
        <h2 className="font-heading font-semibold text-[#EFEFEF] text-sm mb-6">
          Évolution des leads (7 derniers jours)
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4A843" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#8E8E93"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#8E8E93"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (val % 1 === 0 ? val : '')}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1C1E',
                  border: '1px solid #3A3A3C',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                itemStyle={{ color: '#D4A843' }}
                cursor={{ stroke: '#D4A843', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#D4A843"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCount)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
