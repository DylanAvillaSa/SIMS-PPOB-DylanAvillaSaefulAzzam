import React from "react";

const FormHeader = ({ title }) => {
  return (
    <header className='flex flex-col items-center gap-7'>
      <div className='flex items-center gap-2'>
        <img src='/Logo.png' />
        <h2 className='font-semibold text-xl text-slate-700'>SIMS PPOB</h2>
      </div>

      <h1 className='text-2xl font-semibold w-[250px] text-center text-slate-700'>
        {title}
      </h1>
    </header>
  );
};

export default FormHeader;
