import PropTypes from "prop-types";
import { useEffect, useReducer } from "react";
import Pod from './Pod'

const PodGrid = (props) => {
  const { defaultView, setDefaultView, setClickedPod } = props;
  const url = 'http://localhost:3000'
  const podData = [];

  const fetchInfo = async (type, time, level) => {
    const body = {
      type,
      time,
      aggregation: 'avg',
      level
    }
    try {
      const response = await fetch(url + 'query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        data.map(el => {
          podData.push([ el.metric, el.value ])
          /*
          el: {
            metric: {
              pod}
            value: [num, str]
          }
          */ 
        })
      } else {
        const data = await response.json();
        console.error(data);
        alert('😭 Failed to fetch data. Response is not OK!')
      }
    } catch (error) {
      console.error(error);
      alert('😿 Error while fetching data from the server')
    }
  }


  return (
    <div>
        <Pod />
    </div>
  )
}

PodGrid.propTypes = {
  defaultView: PropTypes.boolean,
  setDefaultView: PropTypes.func,
  setClickedPod: PropTypes.func,
};

export default PodGrid;