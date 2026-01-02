import AppRouter from "./routes/AppRouter";
import GlobalTimer from "./layout/GlobalTimer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {

  return (
    <>
      <AppRouter />
      <GlobalTimer />
     <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable={false}
        theme="colored"
      />
    </>
  );

  
}

export default App
