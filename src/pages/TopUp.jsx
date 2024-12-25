import CustomCircle from "../components/element/CustomCircle";

import { useEffect, useState } from "react";
import { IconTopup } from "../components/icon/CustomIcon";
import { toastSuccess } from "../utils/sweetAlert";
import { formatRupiah } from "../services/format_rupiah";

const TopupPage = () => {
  const { token } = JSON.parse(localStorage.getItem("session"));
  const [userProfile, setUserProfile] = useState({
    first_name: "",
    last_name: "",
    profile_image: "",
  });
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nominalTopup, setNominalTopup] = useState("");
  const [showSaldo, setShowSaldo] = useState(false);

  useEffect(() => {
    const getDataFromApi = async () => {
      const user_profile = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = await user_profile.json();
      setUserProfile({
        ...userProfile,
        profile_image: data.profile_image,
        first_name: data.first_name,
        last_name: data.last_name,
      });
      const res_saldo = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/balance`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const saldo = await res_saldo.json();
      const result_saldo = formatRupiah(saldo.data.balance);
      setBalance(result_saldo);
    };

    getDataFromApi();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/topup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ top_up_amount: nominalTopup }),
      });

      const data = await res.json();
      if (data.message == "Top Up Balance berhasil") {
        toastSuccess("Berhasil Top up");
        const res_saldo = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/balance`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const saldo = await res_saldo.json();
        const result_saldo = formatRupiah(saldo.data.balance);
        setBalance(result_saldo);
      }
    } catch (err) {
      throw new Error("error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='w-full min-h-screen mt-32  items-center flex flex-col'>
      <section className='w-full'>
        <header className=' w-full flex gap-24 justify-center'>
          <aside className='flex flex-col'>
            <img
              src={
                userProfile.profile_image.search("/null") == -1
                  ? userProfile?.profile_image
                  : "/profil.png"
              }
              className='w-[85px] h-[85px] rounded-full object-cover'
            />
            <p className='text-base font-normal text-slate-600 mt-2'>
              Selamat datang,
            </p>
            <h2 className='font-semibold text-2xl text-slate-700'>
              {userProfile.first_name} {userProfile.last_name}
            </h2>
          </aside>

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
        </header>
      </section>

      <section className='w-full mt-16 flex px-[17rem] gap-5 flex-col'>
        <header className='flex flex-col gap-0'>
          <p className='text-base font-normal text-slate-600'>
            Silahkan masukan
          </p>
          <h2 className='text-2xl font-semibold tracking-wide'>
            Nominal Top Up
          </h2>
        </header>

        <div className='flex w-ful gap-5'>
          <form
            className='w-[70%] flex flex-col gap-3'
            onSubmit={handleSubmit}>
            <div className='relative'>
              <input
                type='text'
                className='border py-2 px-8 text-sm w-[100%] rounded outline-none opacity-75 text-slate-500'
                placeholder='Masukan nominal Top Up'
                name='topup'
                autoComplete='off'
                value={nominalTopup}
                onChange={(e) => e.preventDefault()}
              />
              <IconTopup />
            </div>
            <button
              type='submit'
              className={`${
                nominalTopup !== ""
                  ? "bg-red-500 rounded text-sm w-[100%] p-2 text-white"
                  : "bg-neutral-300 rounded text-sm w-[100%] p-2 text-white"
              } ${isLoading && "opacity-35"} `}
              disabled={nominalTopup == "" && true}>
              {isLoading ? "Menunggu" : "Top Up"}
            </button>
          </form>

          <aside
            className='flex flex-wrap w-[50%] items-center justify-start gap-3'
            onClick={(e) =>
              setNominalTopup(
                parseFloat(
                  e.target.innerText.replace("Rp", "").replace(/\./g, "").trim()
                )
              )
            }>
            <div className='border  border-slate-400 cursor-pointer rounded text-sm h-[30px] w-[120px] px-6 py-1 text-slate-600'>
              Rp.10.000
            </div>
            <div className='border  border-slate-400 cursor-pointer rounded text-sm h-[30px] w-[120px] px-6 py-1 text-slate-600'>
              Rp.20.000
            </div>
            <div className='border  border-slate-400 cursor-pointer rounded text-sm h-[30px] w-[120px] px-6 py-1 text-slate-600'>
              Rp.50.000
            </div>
            <div className='border  border-slate-400 cursor-pointer rounded text-sm h-[30px] w-[120px] px-6 py-1 text-slate-600'>
              Rp.100.000
            </div>
            <div className='border  border-slate-400 cursor-pointer rounded text-sm h-[30px] w-[120px] px-6 py-1 text-slate-600'>
              Rp.250.000
            </div>
            <div className='border  border-slate-400 cursor-pointer rounded text-sm h-[30px] w-[120px] px-6 py-1 text-slate-600'>
              Rp.500.000
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default TopupPage;
