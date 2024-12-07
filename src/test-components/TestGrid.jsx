
const TestGrid = () => {
  const testArray = [];
  for (let i = 0; i <= 200; i++) {
    testArray.push(i);
  }

  const statusArray = ['active', 'inactive', 'error'];
  let status = ''
  
  const randomStatus = () => {
    status = statusArray[Math.floor(Math.random() * statusArray.length)];
  }

  const color = (value /*value[1]*/, minVal = 0, maxVal /*value[0]*/) => {
    const normalizedValue = (value - minVal) / (maxVal - minVal);
    const r = Math.floor(normalizedValue * 255);

    return `rgb(${r}, 255, 0)`;
  };

  const buttonArray = [];
  for (let i = 1; i < testArray.length; i++) {
    randomStatus();
    if (status === 'active') {
      buttonArray.push(
        <button
          key={i}
          className="m-1 rounded-3xl border-4 border-solid border-slate-950 bg-green-400 py-11"
          style={{
            backgroundColor: color(Math.floor(Math.random() * 100), 0, 100),
          }}
        >
          {testArray[i]}
        </button>,
      );
    } else if (status === 'error') {
      buttonArray.push(
        <button
          key={i}
          className="m-1 rounded-3xl border-4 border-solid border-slate-950 py-11 bg-red-400"
        >
          {testArray[i]}
        </button>,
      );
    } else {
      buttonArray.push(
        <button
          key={i}
          className="m-1 rounded-3xl border-4 border-solid border-slate-950 py-11"
        >
          {testArray[i]}
        </button>,
      );
    }
  }

  return (
    <div id="test-grid" className="grid h-screen grid-cols-10 overflow-scroll">
      {buttonArray}
    </div>
  );
};

export default TestGrid;
