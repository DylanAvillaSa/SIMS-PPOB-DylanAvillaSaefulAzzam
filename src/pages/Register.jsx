import { useState } from "react";
import { IconLock, IconShow, IconUser } from "../components/icon/CustomIcon";
import { Link } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import AuthContainer from "../components/element/AuthContainer";
import FormHeader from "../components/element/FormHeader";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formUser, setFormUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormUser((prevFromUser) => ({ ...prevFromUser, [name]: value }));
  };

  const handleUserRegister = (e) => {
    e.preventDefault();
  };

  return (
    <AuthContainer>
      <AuthLayout title='register'>
        <FormHeader title='Lengkapi data untuk membuat akun' />

        {/* form registrasi */}
        <form
          className='flex flex-col gap-5 w-full justify-center items-center'
          action='POST'
          onSubmit={handleUserRegister}>
          <div className='w-1/2 relative'>
            <input
              type='email'
              placeholder='masukan email anda'
              name='email'
              className='border py-2 px-7 w-full opacity-75 rounded outline-none text-sm'
              value={formUser.email}
              onChange={handleChange}
            />
            <p className='absolute opacity-35 top-1.5 left-1.5'>@</p>
          </div>

          <div className='w-1/2 relative'>
            <input
              type='text'
              placeholder='nama depan'
              name='first_name'
              className='border py-2 px-7 w-full opacity-75 rounded outline-none text-sm'
              value={formUser.first_name}
              onChange={handleChange}
            />
            <IconUser />
          </div>

          <div className='w-1/2 relative'>
            <input
              type='text'
              placeholder='nama belakang'
              name='last_name'
              className='border py-2 px-7 w-full opacity-75 rounded outline-none text-sm'
              value={formUser.last_name}
              onChange={handleChange}
            />
            <IconUser />
          </div>

          <div className='w-1/2 relative'>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='buat password'
              name='password'
              value={formUser.password}
              onChange={handleChange}
              className='border py-2 px-7 w-full opacity-75 rounded outline-none text-sm'
            />
            <IconLock />
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}>
              <IconShow />
            </button>
          </div>

          <div className='w-1/2 relative'>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='konfirmasi password'
              name='confirm_password'
              value={formUser.confirm_password}
              onChange={handleChange}
              className='border py-2 px-7 w-full opacity-75 rounded outline-none text-sm'
            />
            <IconLock />
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}>
              <IconShow />
            </button>
          </div>

          <button className='p-2 w-1/2 bg-red-500 text-white rounded text-sm'>
            Registrasi
          </button>

          <div className='flex gap-1 text-slate-500 text-sm'>
            <p>sudah punya akun ? login</p>
            <Link
              to='/'
              className='text-red-500'>
              disini
            </Link>
          </div>
        </form>
      </AuthLayout>

      <figure className='w-1/2'>
        <img
          src='/login.png'
          className='h-[725px] w-full object-cover'
        />
      </figure>
    </AuthContainer>
  );
};

export default RegisterPage;
