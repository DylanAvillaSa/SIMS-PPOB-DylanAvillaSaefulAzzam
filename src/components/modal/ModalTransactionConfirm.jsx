/* eslint-disable react/prop-types */
import { formatRupiah } from "../../services/format_rupiah";
import { converToRupiah } from "../../services/convert_to_rupiah";
import { toastFailure, toastSuccess } from "../../utils/sweetAlert";

const ModalTransactionConfirm = ({
  serviceData,
  setIsOpenModal,
  setBalance,
}) => {
  const { token } = JSON.parse(localStorage.getItem("session"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res_transaction = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ service_code: serviceData.service_code }),
        }
      );

      if (!res_transaction.ok) {
        const errorMessage = await res_transaction.json();
        toastFailure(errorMessage.message);
        setIsOpenModal(false);
      }

      const result_transaction = await res_transaction.json();

      if (result_transaction.message == "Transaksi berhasil") {
        setIsOpenModal(false);
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

        toastSuccess("Pembayaran berhasil");
      } else {
        toastFailure(`saldo tidak mencukupi`);
        setIsOpenModal(false);
      }
    } catch (err) {
      return false;
    }
  };
  return (
    <div className='w-full min-h-screen bg-black bg-opacity-30 fixed top-0 left-0 right-0 flex justify-center items-center z-20'>
      <section className='w-[320px] h-[270px] flex flex-col items-center justify-between bg-white rounded-lg p-4'>
        <img
          src='/Logo.png'
          className='w-[60px] h-[60px] mx-auto object-cover bg-cover'
          alt='Logo'
        />
        <p className='text-slate-600 text-sm'>
          Beli {serviceData.service_name} Prabayar
        </p>
        <h2 className='font-semibold text-slate-700 text-xl'>
          {converToRupiah(serviceData.service_tariff)}
        </h2>
        <button
          className='text-red-500 font-semibold  text-sm'
          onClick={handleSubmit}>
          Ya, lanjutkan Bayar
        </button>
        <button
          className='text-slate-400 text-sm'
          onClick={() => setIsOpenModal(false)}>
          Batalkan
        </button>
      </section>
    </div>
  );
};

export default ModalTransactionConfirm;
