import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>

    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Component {...pageProps} />
    </div>
    </AuthProvider>
  );
}

export default MyApp;