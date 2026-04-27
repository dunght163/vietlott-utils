import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.css';
import TopBar from './components/Header/TopBar';
import MainHeader from './components/Header/MainHeader';
import NavBar from './components/Header/NavBar';
import KenoResults from './components/KenoResults/KenoResults';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <div id="app">
      <TopBar />
      <MainHeader />
      <NavBar />
      <div className="container">
        <KenoResults />
      </div>
      <Footer />
    </div>
  );
}
