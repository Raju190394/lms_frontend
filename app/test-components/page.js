"use client";
import { useState } from "react";
import { SearchSelect } from "@/components/ui/custom/SearchSelect";
import { MultiSelect } from "@/components/ui/custom/MultiSelect";
import { DatePicker } from "@/components/ui/custom/DatePicker";
import { DateTimePicker } from "@/components/ui/custom/DateTimePicker";
import { DateRangePicker } from "@/components/ui/custom/DateRangePicker";

const options = [
  { label: "React", value: "react" },
  { label: "Next.js", value: "nextjs" },
  { label: "Tailwind CSS", value: "tailwind" },
  { label: "Prisma", value: "prisma" },
  { label: "MySQL", value: "mysql" },
];

export default function TestComponents() {
  const [single, setSingle] = useState("");
  const [multi, setMulti] = useState([]);
  const [date, setDate] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [range, setRange] = useState({ from: null, to: null });

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold border-b pb-2">Reusable Components Demo</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">Search Select (Single)</label>
        <SearchSelect options={options} value={single} onChange={setSingle} />
        <p className="text-xs text-gray-500">Selected: {single}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Multi-Select with Search</label>
        <MultiSelect options={options} selected={multi} onChange={setMulti} />
        <p className="text-xs text-gray-500">Selected: {multi.join(", ")}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date Picker</label>
        <DatePicker date={date} setDate={setDate} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date & Time Picker</label>
        <DateTimePicker date={dateTime} setDate={setDateTime} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date Range Picker</label>
        <DateRangePicker dateRange={range} setDateRange={setRange} />
      </div>
    </div>
  );
}
