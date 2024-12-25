import { useState } from "react";
import { IconLock, IconShow, IconUser } from "../components/icon/CustomIcon";
import { Link } from "react-router-dom";
import { toastSuccess, toastSuccessRegister } from "../utils/sweetAlert";

import AuthLayout from "../components/layout/AuthLayout";
import AuthContainer from "../components/element/AuthContainer";
import FormHeader from "../components/element/FormHeader";

const RegisterPage = () => {
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
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
    setIsError(false);
    setEmailError("");
    setFirstNameError("");
    setLastNameError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const handleUserRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setEmailError("");
    setFirstNameError("");
    setLastNameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!formUser.email || !/\S+@\S+\.\S+/.test(formUser.email)) {
      setEmailError("Email tidak valid");
      isValid = false;
    }

    if (!formUser.first_name) {
      setFirstNameError("Nama depan tidak boleh kosong");
      isValid = false;
    }

    if (!formUser.last_name) {
      setLastNameError("Nama belakang tidak boleh kosong");
      isValid = false;
    }

    if (!formUser.password || formUser.password.length < 8) {
      setPasswordError("Password harus terdiri dari minimal 8 karakter");
      isValid = false;
    }

    if (formUser.password !== formUser.confirm_password) {
      setConfirmPasswordError("Password tidak sama");
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const res_register = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formUser.email,
            first_name: formUser.first_name,
            last_name: formUser.last_name,
            password: formUser.password,
          }),
        }
      );

      const res = await res_register.json();
      if (res.status === 0) {
        toastSuccessRegister("Registrasi Berhasil");
      } else {
        setIsError(true);
        setMessageError(res.message || "Terjadi kesalahan, coba lagi");
      }
    } catch (err) {
      throw new Error(err);
    } finally {
      setIsLoading(false);
      setFormUser({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: "",
      });
    }
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
            {emailError && (
              <p className='text-red-500 text-xs mt-2 self-end'>{emailError}</p>
            )}
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
            {firstNameError && (
              <p className='text-red-500 text-xs mt-2 self-end'>
                {firstNameError}
              </p>
            )}
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
            {lastNameError && (
              <p className='text-red-500 text-xs mt-2 self-end'>
                {lastNameError}
              </p>
            )}
          </div>

          <div className='w-1/2 relative flex flex-col'>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='buat password'
              name='password'
              value={formUser.password}
              onChange={handleChange}
              className={`border py-2 px-7 w-full opacity-75 rounded outline-none text-sm `}
            />
            <IconLock />
            {passwordError && (
              <p className='text-red-500 text-xs mt-2 self-end'>
                {passwordError}
              </p>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}>
              <IconShow />
            </button>
          </div>

          <div className='w-1/2 relative flex flex-col'>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='konfirmasi password'
              name='confirm_password'
              value={formUser.confirm_password}
              onChange={handleChange}
              className={`border py-2 px-7 w-full opacity-75 rounded outline-none text-sm ${
                isError && "border-red-500 border"
              }`}
            />
            <IconLock />
            {confirmPasswordError && (
              <p className='text-red-500 text-xs mt-2 self-end'>
                {confirmPasswordError}
              </p>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}>
              <IconShow />
            </button>
          </div>

          <button
            className={`p-2 w-1/2 bg-red-500 text-white rounded text-sm ${
              isLoading && "opacity-35"
            }`}
            disabled={isLoading}>
            {isLoading ? "Menunggu..." : "Registrasi"}
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
