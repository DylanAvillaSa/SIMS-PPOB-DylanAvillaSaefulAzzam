import React, { useEffect, useState } from "react";

import CustomCircle from "../components/element/CustomCircle";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatRupiah } from "../services/format_rupiah";
import { Link } from "react-router-dom";

const fetchData = async (url, token) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${url}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const DashboardPage = () => {
  const { token } = useSelector((state) => state.session);
  const [dataBanner, setDataBanner] = useState([]);
  const [dataService, setDataService] = useState([]);
  const navigate = useNavigate();
  const [showSaldo, setShowSaldo] = useState(false);
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    profile_image: "",
  });
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch profile and other data on mount
  useEffect(() => {
    const getProfileUser = async () => {
      setLoading(true);
      try {
        // Fetch multiple data concurrently
        const [banner, service, saldo, profile] = await Promise.all([
          fetchData(`${import.meta.env.VITE_API_BASE_URL}/banner`, token),
          fetchData(`${import.meta.env.VITE_API_BASE_URL}/services`, token),
          fetchData(`${import.meta.env.VITE_API_BASE_URL}/balance`, token),
          fetchData(`${import.meta.env.VITE_API_BASE_URL}/profile`, token),
        ]);

        // Set state with fetched data
        setDataBanner(banner.data);
        setDataService(service.data);

        // Format balance and set it
        const formattedBalance = formatRupiah(saldo.data.balance);
        setBalance(formattedBalance);

        const { email, first_name, last_name, profile_image } = profile.data;
        setUserProfile({ email, first_name, last_name, profile_image });
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getProfileUser();
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className='w-full min-h-screen flex flex-col gap-12'>
      <section className='flex gap-32 items-center px-12 justify-center  mt-20'>
        <div className='flex flex-col justify-center items-start gap-2'>
          <img
            src={
              userProfile.profile_image.search("/null") == -1
                ? userProfile?.profile_image
                : "/profil.png"
            }
            className='w-[100px] h-[100px] rounded-full object-cover'
          />
          <article>
            <p className='text-slate-600  font-normal text-base'>
              Selamat datang,
            </p>
            <h2 className='font-semibold text-2xl text-slate-700'>
              {userProfile.first_name} {userProfile.last_name}
            </h2>
          </article>
        </div>

        <figure className='relative bg'>
          <img
            src='/bg-saldo.png'
            alt='Saldo'
            className='w-full h-auto object-cover'
          />
          <h3 className='absolute top-8 left-7 text-white text-lg font-semibold '>
            Saldo anda
          </h3>
          <h2 className='absolute top-[4.3rem] left-7 text-white text-3xl font-bold'>
            RP {!showSaldo ? balance : <CustomCircle />}
          </h2>
          <button
            className='text-xs text-white absolute top-[7.3rem] left-7'
            onClick={(e) => {
              e.preventDefault();
              setShowSaldo(!showSaldo);
            }}>
            {!showSaldo ? "Tutup saldo" : "Lihat Saldo"}
          </button>
        </figure>
      </section>

      <section className='flex gap-8  px-24 items-center'>
        {dataService.map((data) => (
          <Link
            to={`/pembayaran/${data.service_code}`}
            key={data.service_code}
            className='flex flex-col items-center gap-2 w-[120px] h-[120px] cursor-pointer'>
            <img
              src={data.service_icon}
              className='w-[60px] h-[60px] object-cover'
              alt='gambar'
            />
            <p className='text-[0.7rem] w-[60px] text-center text-slate-600'>
              {data.service_name}
            </p>
          </Link>
        ))}
      </section>

      <section className='flex flex-col  px-24 w-full  items-center gap-3 overflow-hidden'>
        <h2 className='font-semibold self-start text-slate-600'>
          Temukan promo menarik
        </h2>

        <figure className='flex gap-10 overflow-x-scroll scrollbar-hidden'>
          {dataBanner.map((data) => (
            <React.Fragment key={data.banner_name}>
              <img
                src={data.banner_image}
                alt={data.banner_name}
                className='w-[300px] h-auto object-cover'
              />
            </React.Fragment>
          ))}
        </figure>
      </section>
    </main>
  );
};

export default DashboardPage;
