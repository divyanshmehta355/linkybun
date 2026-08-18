"use client";

import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Analytics({ data }: { data: any[] }) {
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(
    data && data.length > 0 ? data[0].link_id : null
  );

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>No links to track yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const selectedLink = data.find(l => l.link_id === selectedLinkId) || data[0];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Clicks over the last 7 days</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <select 
            value={selectedLinkId || ""} 
            onChange={(e) => setSelectedLinkId(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {data.map(link => (
              <option key={link.link_id} value={link.link_id}>
                {link.title} ({link.total_clicks} total clicks)
              </option>
            ))}
          </select>
        </div>

        <div className="h-[200px] w-full">
          {selectedLink.clicks_last_7_days && selectedLink.clicks_last_7_days.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedLink.clicks_last_7_days}>
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Bar 
                  dataKey="clicks" 
                  fill="currentColor" 
                  radius={[4, 4, 0, 0]} 
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-md">
              No clicks in the last 7 days
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
