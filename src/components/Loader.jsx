import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-gradient-dark flex justify-center items-center z-[9999] transition-opacity duration-500 ${hidden ? 'opacity-0 invisible' : ''}`}>
      <div className="w-[70px] h-[70px] border-[5px] border-white/10 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;

