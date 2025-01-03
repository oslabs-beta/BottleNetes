/**
 * This component will render the loading screen whenever something is fetching or waiting to be rendered
 */

import { Hexagon } from "lucide-react";

const LoadingContainer = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center text-center align-middle font-mono">
      <Hexagon
        className="absolute size-64 animate-slow-spin"
        color="rgb(14, 116, 144)"
        strokeWidth={0.5}
      />
      <Hexagon
        className="absolute size-64 animate-slow-spin opacity-35"
        color="rgb(8 145 178)"
        strokeWidth={1}
      />
      <p className="animate-text-color-animation text-2xl tracking-widest">
        Loading...
      </p>
    </div>
  );
};

export default LoadingContainer;
