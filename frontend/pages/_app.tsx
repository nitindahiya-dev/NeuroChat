import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;