import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/auth/login";
import { Register } from "./pages/register/register";
import { Profile } from "./pages/profile/profile";
import { Login } from "./pages/login/login";
import { Spreadsheet } from "./pages/spreadsheet/spreadsheet";

// Substitua pelo seu Client ID do Google Cloud Console
const GOOGLE_CLIENT_ID = '488870637998-g1pcd375eumun0fo24pt1g3q8l2qlsae.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/spreadsheet" element={<Spreadsheet />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
