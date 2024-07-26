import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import SignUpPage from './pages/auth/signup/SignUpPage.jsx';
import SignInPage from './pages/auth/signin/SignInPage.jsx';
import HomePage from './pages/home/HomePage.jsx';
import NotificationPage from './pages/notification/Notification.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';



const router = createBrowserRouter([

  {
    path: "/signup",
    element: <SignUpPage />
  },
  {
    path: "/signin",
    element: <SignInPage />
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "notifications",
        element: <NotificationPage />
      },
      {
        path: "profile/:username",
        element: <ProfilePage />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <RouterProvider router={router} />
  </React.StrictMode>,
)
