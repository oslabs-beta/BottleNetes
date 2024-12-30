/**
 * This component will render the loading screen whenever something is fetching or waiting to be rendered
 */

import React, { Hexagon } from 'lucide-react';

const LoadingContainer = () => {
  return (
    <div
      id="login-container"
      className="relative -z-10 flex h-screen w-screen flex-col items-center justify-center bg-slate-600/30 text-center align-middle font-mono"
    >
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
      <p className=' tracking-widest text-2xl animate-text-color-animation'>Loading...</p>
    </div>
  );
}

export default LoadingContainer;