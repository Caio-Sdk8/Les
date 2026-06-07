import AppRoutes from "./routes/AppRoutes";
import { GlobalApiErrorToast } from "./components/GlobalApiErrorToast/GlobalApiErrorToast";
import { IAChatWidget } from "./components/IAChatWidget/IAChatWidget";

function App() {
  return (
    <>
      <GlobalApiErrorToast />
      <AppRoutes />
      <IAChatWidget />
    </>
  );
}

export default App;
