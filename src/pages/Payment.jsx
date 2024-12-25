import { useState, useEffect } from "react";
import { formatRupiah } from "../services/format_rupiah";
import CustomCircle from "../components/element/CustomCircle";
import { IconTopup } from "../components/icon/CustomIcon";
import { useParams } from "react-router-dom";
import ModalTransactionConfirm from "../components/modal/ModalTransactionConfirm";

const PaymentPage = () => {
  const { service_code } = useParams();
  const { token } = JSON.parse(localStorage.getItem("session"));
  const [userProfile, setUserProfile] = useState({
    first_name: "",
    last_name: "",
    profile_image: "",
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showSaldo, setShowSaldo] = useState("");
  const [balance, setBalance] = useState("");
  const [serviceData, setServiceData] = useState(null);

  // mengambil service api
  useEffect(() => {
    const getServiceData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/services`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const datas = await response.json();
        const filterData = datas.data.filter(
          (data) => data.service_code == service_code
        );
        setServiceData(filterData[0]);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    if (service_code) {
      getServiceData();
    }
  }, [service_code, token]);

  // mengambil user profile dan saldo
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
    setIsOpenModal(true);
  };

  return (
    <main className='w-full  mt-[8.5rem]  items-center flex flex-col'>
      <section className='w-full'>
        <header className=' w-full flex gap-24 justify-center'>
          <aside className='flex flex-col'>
            <img
              src={
                userProfile.profile_image.search("/null") == -1
                  ? userProfile?.profile_image
                  : "/profil.png"
              }
              className='w-[65px] h-[65px] rounded-full object-cover'
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

      <section className='w-[60%] mt-12  justify-center   flex'>
        <div className='flex flex-col w-full gap-2'>
          <h2 className='font-normal'>Pembayaran</h2>
          <article className='flex items-center gap-2'>
            <img
              src={serviceData?.service_icon}
              className='w-[24px] h-[24px] object-cover'
            />
            <p className='font-semibold'>
              {serviceData?.service_name}{" "}
              {serviceData?.service_name == "Listrik" && "Prabayar"}
            </p>
          </article>

          <form
            action='POST'
            className='w-full flex-col flex gap-3'
            onSubmit={handleSubmit}>
            <div className='relative'>
              <input
                type='text'
                className='border outline-none opacity-90 py-2 px-8 text-sm w-full'
                placeholder='10.000'
                value={serviceData?.service_tariff || 0}
                disabled
                onChange={(e) => e.preventDefault()}
              />
              <IconTopup />
            </div>
            <button className={`bg-red-500 text-white rounded p-2 text-sm`}>
              Bayar
            </button>
          </form>
        </div>
      </section>

      {isOpenModal && (
        <ModalTransactionConfirm
          serviceData={serviceData}
          setIsOpenModal={setIsOpenModal}
          setBalance={setBalance}
        />
      )}
    </main>
  );
};

export default PaymentPage;
