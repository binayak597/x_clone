import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LeftSideBar from "./components/common/LeftSideBar"
import RightPanel from "./components/common/RightPanel"
import SignInPage from "./pages/auth/signin/SignInPage";
import NotificationPage from "./pages/notification/Notification";
import ProfilePage from "./pages/profile/ProfilePage";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/common/LoadingSpinner";
import useGetme from "./hooks/useGetme";

function App() {


const { data: authUserData, isLoading } = useGetme();

  if(isLoading) {

    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
			{/* Common component, bc it's not wrapped with Routes */}
			{authUserData && <LeftSideBar />}
			<Routes>
				<Route path='/' element={authUserData ? <HomePage /> : <Navigate to='/signin' />} />
				<Route path='/signin' element={!authUserData ? <SignInPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUserData ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUserData ? <NotificationPage /> : <Navigate to='/signin' />} />
				<Route path='/profile/:username' element={authUserData ? <ProfilePage /> : <Navigate to='/signin' />} />
			</Routes>
			{authUserData && <RightPanel />}
		</div>
  )
}

export default App
