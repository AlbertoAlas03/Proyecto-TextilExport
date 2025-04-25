import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import ChangePassword from './components/ChangePassword';
import SendEmail from './components/SendEmail';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='*' element={<PageNotFound />} />
        <Route path='/send-email' element={<SendEmail />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
