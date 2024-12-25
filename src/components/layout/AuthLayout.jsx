const AuthLayout = ({ children, title }) => {
  return (
    <section
      className='w-1/2 flex flex-col items-center justify-center gap-5'
      id={title}>
      {children}
    </section>
  );
};

export default AuthLayout;
