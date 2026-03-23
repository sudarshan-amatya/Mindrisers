import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default RootLayout;
