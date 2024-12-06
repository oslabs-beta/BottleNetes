const TestGrid = () => {
  const testArray = [];
  for (let i = 0; i <= 200; i++) {
    testArray.push(i);
  }

  const color = (value /*value[1]*/, minVal = 0, maxVal /*value[0]*/) => {
    const numValue = parseInt(value);
    if (!numValue) return "red";
    if (!active) return "transparent";

    const normalizedValue = (numValue - minVal) / (maxVal - minVal);
    const r = Math.floor(normalizedValue * 255);

    return `rgb(${r}, 255, 0)`;
  };

  const statusArray = ['active', 'inactive', 'error'];
  

  const buttonArray = [];
  for (let i = 1; i < testArray.length; i++) {
    buttonArray.push(
      <button
        key={i}
        className="border-4 m-1 rounded-3xl border-solid border-slate-950 py-11"
        style={{}}
      >
        {testArray[i]}
      </button>,
    );
  }

  return (
    <div id="test-grid" className="grid h-screen grid-cols-10 overflow-scroll">
      {buttonArray}
    </div>
  );
};

export default TestGrid;
