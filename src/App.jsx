import { lazy, Suspense } from "react";
import { Navbar, Footer } from "./components";

// Lazy load del componente Globe
const Globe = lazy(() => import("./components/Globe"));

function App() {
  return (
    <div className="app">
      <Navbar />
      {/* Suspense mostrará fallback mientras Globe se carga */}
      <Suspense
        fallback={
          <p className="h-screen w-screen flex justify-center items-center text-cente text-red-500">
            Loading...
          </p>
        }
      >
        <Globe />
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
