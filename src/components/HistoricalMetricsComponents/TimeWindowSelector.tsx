import { useState } from "react";

interface TimeWindowSelectorProps {
    onTimeWindowChange: (value: string) => void;
}

const TimeWindowSelector = ({ onTimeWindowChange }: TimeWindowSelectorProps) => {
    // Default to showing past 24 hours
    const [selectedWindow, setSelectedWindow] = useState("24h");

    const options = [
        { label: "Last 5 minutes", value: "5m" },
        { label: "Last 1 hour", value: "1h" },
        { label: "Last 24 hours", value: "24h" },
    ];

    return (
        <select className="w-full rounded-lg border-2 border-transparent bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition duration-200 hover:brightness-90 dark:bg-slate-800 dark:text-slate-300" onChange={(e) => {
            setSelectedWindow(e.target.value);
            onTimeWindowChange(e.target.value);
        }}
        value={selectedWindow}>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}

export default TimeWindowSelector;