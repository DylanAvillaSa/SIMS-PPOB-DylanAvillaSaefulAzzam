import { Link } from "react-router-dom";
const NavigationBar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 py-3 px-2 items-center border-b justify-around flex z-10 bg-white'>
      <Link
        to='/dashboard'
        className='flex items-center gap-2'>
        <img
          src='/Logo.png'
          className='w-[25px] h-[25px]'
        />
        <h2 className='font-semibold text-slate-800'>SIMS PPOB</h2>
      </Link>
      <ul className='flex items-center gap-14 text-slate-800 font-normal  text-sm'>
        <Link
          to='/topup'
          className='active:text-red-500 hover:text-red-500'>
          Top Up
        </Link>

        <Link
          to='/transaction'
          className='active:text-red-500 hover:text-red-500'>
          Transaction
        </Link>

        <Link
          to='/akun'
          className='active:text-red-500 hover:text-red-500'>
          Akun
        </Link>
      </ul>
    </nav>
  );
};

export default NavigationBar;
