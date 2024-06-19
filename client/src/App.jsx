import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import ProfilePage from './pages/ProfilePage'
import CarsPage from './pages/CarsPage'
import CarsFormPage from './pages/CarsFormPage'
import CarPage from './pages/CarPage'
import TripsPage from './pages/TripsPage'
import TripPage from './pages/TripPage'
import DealsPage from './pages/DealsPage'
import DealPage from './pages/DealPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage' // Import the ConfirmEmailPage component
import TripDetailsPage from './pages/TripDetailsPage'; // Import the new page


axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/account' element={<ProfilePage />} />
          <Route path='/account/cars' element={<CarsPage />} />
          <Route path='/account/cars/new' element={<CarsFormPage />} />
          <Route path='/account/cars/:id' element={<CarsFormPage />} />
          <Route path='/car/:id' element={<CarPage />} />
          <Route path='/account/trips' element={<TripsPage />} />
          <Route path='/account/trips/:id' element={<TripPage />} />
          <Route path='/account/trips/:id/details' element={<TripDetailsPage />} />
          <Route path='/account/deals' element={<DealsPage />} />
          <Route path='/account/deals/:id' element={<DealPage />} />
          <Route path='/account/trips/:id/details' element={<TripDetailsPage />} />
        </Route>
        <Route path='/confirm-email' element={<ConfirmEmailPage />} />        
      </Routes>
    </UserContextProvider>
  )
}

export default App
