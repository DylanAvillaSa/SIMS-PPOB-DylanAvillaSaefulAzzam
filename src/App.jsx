import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import RegisterPage from "./pages/Register";
import AccountPage from "./pages/Account";
import NavigationBar from "./components/element/NavigationBar";
import TopupPage from "./pages/TopUp";
import PaymentPage from "./pages/Payment";
import TransactionPage from "./pages/Transaction";

const RooterApp = () => {
  const location = useLocation().pathname;

  return (
    <>
      {location !== "/" && location !== "/register" && <NavigationBar />}

      <Routes>
        <Route
          path='/'
          element={<LoginPage />}
        />
        <Route
          path='/dashboard'
          element={<DashboardPage />}
        />
        <Route
          path='/register'
          element={<RegisterPage />}
        />
        <Route
          path='/akun'
          element={<AccountPage />}
        />
        <Route
          path='/topup'
          element={<TopupPage />}
        />
        <Route
          path='/transaction'
          element={<TransactionPage />}
        />
        <Route
          path='/pembayaran/:service_code'
          element={<PaymentPage />}
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <RooterApp />
    </BrowserRouter>
  );
};

export default App;
