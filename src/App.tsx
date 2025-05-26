import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth/login";
import { Register } from "./pages/register/register";
import { Profile } from "./pages/profile/profile";
import { Login } from "./pages/login/login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
