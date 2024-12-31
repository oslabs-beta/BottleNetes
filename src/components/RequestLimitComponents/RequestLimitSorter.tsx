import dataStore from '../../stores/dataStore';

const RequestLimitSorter = () => {
  const { setSortType, selectedLabel, setSelectedLabel } = dataStore();

  const sortOptions = [
    { type: "", label: "Sort by..." },
    { type: "podName", label: "Pod Name" },
    { type: "request", label: "Requested Resources" },
    { type: "limit", label: "Resource Limits" },
    { type: "ratio", label: "Request/Limit Ratio" },
  ];

  return (
    <div className="flex justify-end">
      <select
        value=""
        onChange={(e) => {
          const selected = sortOptions.find(
            (opt) => opt.type === e.target.value,
          );
          if (selected) {
            setSelectedLabel(
              selected.type ? `Sorting by: ${selected.label}` : selected.label,
            );
            setSortType(selected.type);
          }
        }}
        className="w-fit rounded-lg border-2 border-transparent bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition duration-200 hover:brightness-90 dark:bg-slate-800 dark:text-slate-300"
      >
        <option value="" disabled hidden>
          {selectedLabel}
        </option>
        {sortOptions.map((option) => (
          <option key={option.type} value={option.type}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RequestLimitSorter;
