import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/auth/login";
import { Register } from "./pages/register/register";
import { Profile } from "./pages/profile/profile";
import { Login } from "./pages/login/login";
import { Spreadsheet } from "./pages/spreadsheet/spreadsheet";
import { Admin } from './pages/admin/Admin';
import { PrivateRoute } from './components/PrivateRoute';

// Substitua pelo seu Client ID do Google Cloud Console
const GOOGLE_CLIENT_ID = '488870637998-g1pcd375eumun0fo24pt1g3q8l2qlsae.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/spreadsheet" element={<Spreadsheet />} />
            <Route path="/adm" element={<PrivateRoute><Admin /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
