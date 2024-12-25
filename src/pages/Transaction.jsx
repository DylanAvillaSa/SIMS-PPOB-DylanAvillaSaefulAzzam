import { useState, useEffect } from "react";
import { formatRupiah } from "../services/format_rupiah";
import CustomCircle from "../components/element/CustomCircle";
import { converToRupiah } from "../services/convert_to_rupiah";

const TransactionPage = () => {
  const { token } = JSON.parse(localStorage.getItem("session"));
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [balance, setBalance] = useState("");
  const [historyTransaction, setHistoryTransaction] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [userProfile, setUserProfile] = useState({
    first_name: "",
    last_name: "",
    profile_image: "",
  });
  const [showSaldo, setShowSaldo] = useState("");
  const limit = 5;

  // hit api history transaction
  const getHistoryTransaction = async () => {
    setIsLoading(true);
    try {
      const numericOffset = Number(offset);
      const numericLimit = Number(limit);
      const res_history = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/transaction/history?offset=${numericOffset}&limit=${numericLimit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const res = await res_history.json();
      if (res.data.records.length > 0) {
        setHistoryTransaction((prev) => [...prev, ...res.data.records]);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      throw new Error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
    getHistoryTransaction();
  };

  useEffect(() => {
    getHistoryTransaction();
  }, [token]);

  // hit api user profile
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

  return (
    <main className='w-full  mt-[5.5rem]  items-center flex flex-col'>
      <section className='w-full'>
        <header className=' w-full flex gap-24 justify-center'>
          <aside className='flex flex-col'>
            <img
              src={
                userProfile.profile_image
                  ? userProfile.profile_image
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

      <section className='w-full px-[19.5rem] mt-12 flex flex-col'>
        <h2 className='font-semibold'>Semua Transaksi</h2>
        {historyTransaction.length > 0 ? (
          historyTransaction.map((history, index) => (
            <div
              className='w-full rounded border px-2 py-2 mt-5 items-center flex justify-between'
              key={index}>
              <aside className='flex flex-col gap-1 items-start'>
                {history.transaction_type == "TOPUP" ? (
                  <h3 className='text-teal-400 text-base font-semibold'>
                    + {converToRupiah(history.total_amount)}
                  </h3>
                ) : (
                  <h3 className='text-red-500 text-base font-semibold'>
                    - {converToRupiah(history.total_amount)}
                  </h3>
                )}

                <p className='text-[.6rem] px-4 text-slate-500'>
                  17 agustus 2023
                </p>
              </aside>
              <h2 className='text-xs font-normal'>
                {history.transaction_type == "TOPUP"
                  ? "Top up saldo"
                  : `${history.description} Prabayar`}
              </h2>
            </div>
          ))
        ) : (
          <p className='text-center text-slate-400 text-xs font-normal mt-12'>
            Maaf tidak ada history transaksi saat ini
          </p>
        )}

        {isLoading && <p>Menunggu...</p>}

        {historyTransaction.length > 0 && (
          <button
            className='text-red-500 font-normal text-sm mt-10 mb-10'
            type='button'
            onClick={handleShowMore}>
            Show more
          </button>
        )}
      </section>
    </main>
  );
};

export default TransactionPage;
