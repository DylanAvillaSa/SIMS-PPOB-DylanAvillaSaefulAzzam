import { IconCheck } from "../icon/CustomIcon";

const ModalSucces = () => {
  return (
    <div className='w-full min-h-screen bg-black bg-opacity-30 fixed top-0 left-0 right-0 flex justify-center items-center z-20'>
      <section className='w-[320px] h-[270px] flex flex-col items-center justify-between bg-white rounded-lg p-4'>
        <h1>Hello world</h1>
        <IconCheck />
      </section>
    </div>
  );
};

export default ModalSucces;
