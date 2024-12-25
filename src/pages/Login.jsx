import { useEffect, useState } from "react";
import { IconLock, IconShow } from "../components/icon/CustomIcon";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthContainer from "../components/element/AuthContainer";
import AuthLayout from "../components/layout/AuthLayout";
import FormHeader from "../components/element/FormHeader";
import { login } from "../redux/features/token/sessionSlice";

const LoginPage = () => {
  const token = useSelector((state) => state.session.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formUser, setFormUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setErrorStatus(false);
    }, 2500);
  }, [errorStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormUser((prevFromUser) => ({ ...prevFromUser, [name]: value }));
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(formUser),
        }
      );

      const resultFromResponse = await response.json();

      if (resultFromResponse.data === null) {
        setErrorStatus(true);
      } else {
        setErrorStatus(false);
        dispatch(login(resultFromResponse.data.token));
        if (resultFromResponse.data.token) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      throw new Error(err);
    } finally {
      setLoading(false);
      setFormUser({
        email: "",
        password: "",
      });
    }
  };

  return (
    <AuthContainer>
      {/* section form  */}
      <AuthLayout>
        <FormHeader title='Masuk atau buat akun untuk memulai' />

        <form
          className='flex flex-col gap-5 w-full justify-center items-center'
          action='POST'
          onSubmit={handleUserLogin}>
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
              type={showPassword ? "text" : "password"}
              placeholder='masukan password anda'
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
          <button
            className={`p-2 w-1/2 bg-red-500 text-white rounded text-sm ${
              loading && "opacity-40"
            }`}
            disabled={loading}>
            {loading ? "Menunggu..." : "Masuk"}
          </button>
          <div className='flex gap-1 text-slate-500 text-sm'>
            <p>Belum punya akun ? registrasi</p>
            <Link
              to='/register'
              className='text-red-500'>
              disini
            </Link>
          </div>
        </form>

        {errorStatus && (
          <div className='p-1.5 flex w-[35%] absolute bottom-20 left-26  bg-red-50 rounded text-white px-5 items-center justify-between'>
            <p className='text-sm text-orange-400'>
              Password yang anda masukan salah
            </p>
            <button
              onClick={() => setErrorStatus(false)}
              className='font-semibold text-orange-400'>
              x
            </button>
          </div>
        )}
      </AuthLayout>

      {/* section image */}
      <figure className='w-1/2'>
        <img
          src='/login.png'
          className='h-[725px] w-full object-cover'
        />
      </figure>
    </AuthContainer>
  );
};

export default LoginPage;
