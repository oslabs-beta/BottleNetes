import PropTypes from "prop-types";

const Pod = (props) => {
    const { pod, onClick } = props;

    // function to normalize metric value and return rgb color
    const color = (value) => {
        ////
    }

    return (
        <button
            style={{
                //tailwind stuff
            }}
            onClick={() => onClick(/*pod name */)}
        >
            {/* pod name */}
        </button>
    )
};

Pod.propTypes = {
    pod: PropTypes.shape({
        // name and metric value, string and number
    }),
    onClick: PropTypes.func,
};

export default Pod;