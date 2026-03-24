import AppRoutes from "./routes/AppRoutes";
import { GlobalApiErrorToast } from "./components/GlobalApiErrorToast/GlobalApiErrorToast";

function App() {
  return (
    <>
      <GlobalApiErrorToast />
      <AppRoutes />
    </>
  );
}

export default App;
