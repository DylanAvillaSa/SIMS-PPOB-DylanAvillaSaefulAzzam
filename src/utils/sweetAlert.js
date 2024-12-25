import Swal from "sweetalert2";
import { formatRupiah } from "../services/format_rupiah";

export const toastError = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "error",
    title: "format harus jpeg , png",
  });
};

export const toastSuccess = (nominal) => {
  Swal.fire({
    icon: "success",
    title: formatRupiah(nominal),
    text: "Something went wrong!",
    footer: '<a href="#">Why do I have this issue?</a>',
  });
};
