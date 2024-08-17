import { NavigationBar } from "./components/layout/navbar";
import Footer from "./components/layout/Footer";
import Router from "./router/routes";

function App() {
  return (
    <>
      <NavigationBar />
      <Router />
      <Footer />
    </>
  );
}

export default App;