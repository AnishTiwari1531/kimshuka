import './App.css';
import Header from './Header&Footer/Header';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from './Header&Footer/Footer';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import PrivateComponent from './Components/PrivateComponent';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>

          <Route element={<PrivateComponent />} >
            <Route path='/' element={<h1>Profile</h1>} />
            <Route path='/logout' element={<h1>Logout</h1>} />
          </Route>

          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
