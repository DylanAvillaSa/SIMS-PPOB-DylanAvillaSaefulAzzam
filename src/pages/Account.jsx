import { useEffect, useState, useRef } from "react";
import { IconEdit } from "../components/icon/CustomIcon";
import { toastError, toastSuccess } from "../utils/sweetAlert";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/token/sessionSlice";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = JSON.parse(localStorage.getItem("session"));
  const [userProfile, setUserProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    profile_image: "",
  });
  const fileInputRef = useRef(null);

  const handleEditImage = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    setIsEdit(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.type;
      if (fileType !== "image/jpeg" || fileType !== "image/png") {
        toastError();
        e.target.value = null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res_edit_user = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/profile/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
          }),
        }
      );
      const res = await res_edit_user.json();
      if (res.message == "Sukses") {
        toastSuccess("Berhasil mengubah profil");
        setIsEdit(false);
      }
    } catch (err) {
      throw new Error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/jsons",
            },
          }
        );

        const dataUser = await response.json();
        const { email, first_name, last_name, profile_image } = dataUser.data;

        setUserProfile((prevUser) => ({
          ...prevUser,
          email,
          first_name,
          last_name,
          profile_image,
        }));
      } catch (err) {
        throw new Error(err);
      }
    };

    getUserProfile();
  }, [token]);

  return (
    <section className='mt-12 w-full flex justify-center items-center py-12'>
      <form
        className='flex flex-col gap-5 w-[600px]'
        onSubmit={handleSubmit}>
        <header className='flex self-center flex-col items-center gap-2'>
          <div className='relative'>
            <img
              src={
                userProfile.profile_image.search("/null") == -1
                  ? userProfile?.profile_image
                  : "/profil.png"
              }
              alt='Profile'
              className='w-[140px] h-[140px] rounded-full object-cover'
            />
            <input
              ref={fileInputRef}
              type='file'
              className='hidden'
              accept='image/jpeg, image/png'
              disabled={!isEdit ? true : false}
              onChange={handleImageChange}
            />
            <div
              onClick={handleEditImage}
              className='absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer'>
              <IconEdit />
            </div>
          </div>

          <p className='text-xl font-semibold text-slate-700'>
            {userProfile.first_name} {userProfile.last_name}
          </p>
        </header>

        <label
          htmlFor='email'
          className='flex flex-col gap-2'>
          <span className='text-sm'>Email</span>
          <input
            type='email'
            id='email'
            name='email'
            disabled={!isEdit ? true : false}
            className='border w-full p-2 rounded text-xs opacity-65'
            onChange={handleChange}
            value={userProfile.email}
          />
        </label>

        {/* nama depan */}
        <label
          htmlFor='first_name'
          className='flex flex-col gap-2'>
          <span className='text-sm'>Nama depan</span>
          <input
            type='first_name'
            id='first_name'
            name='first_name'
            disabled={!isEdit ? true : false}
            className='border w-full p-2 rounded text-xs opacity-65'
            onChange={handleChange}
            value={userProfile.first_name}
          />
        </label>

        {/* nama belakang */}
        <label
          htmlFor='last_name'
          className='flex flex-col gap-2'>
          <span className='text-sm'>Nama belakang</span>
          <input
            type='last_name'
            disabled={!isEdit ? true : false}
            id='last_name'
            name='last_name'
            className='border w-full p-2 rounded text-xs opacity-65'
            onChange={handleChange}
            value={userProfile.last_name}
          />
        </label>

        {isEdit ? (
          ""
        ) : (
          <button
            className='border-red-500 text-red-500 border p-2 text-sm rounded'
            onClick={handleEditProfile}>
            Edit profile
          </button>
        )}
        {isEdit ? (
          <button
            className='bg-red-500 p-2 text-sm rounded text-white'
            type='submit'>
            Simpan
          </button>
        ) : (
          <button
            className='bg-red-500 p-2 text-sm rounded text-white'
            onClick={(e) => {
              e.preventDefault();
              dispatch(logout());
              navigate("/");
            }}>
            Logout
          </button>
        )}

        <button></button>
      </form>
    </section>
  );
};

export default AccountPage;
