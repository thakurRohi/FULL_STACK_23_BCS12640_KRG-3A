import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { AuthLayout, Login } from './Components/index.js'


import AddPost from "./pages/AddPost";
import Signup from './pages/Signup'
import EditPost from "./pages/EditPost";
import UserProfiles from './pages/UserProfiles.jsx'

import Post from "./pages/Post";
import MyPosts from "./pages/MyPosts";
import AllPosts from "./pages/AllPosts";
import EditProfile from './pages/EditProfile.jsx'
import Bookmarks from './pages/Bookmarks.jsx'
import FollowingUsers from './Components/FollowingUsers.jsx'
import FollowDetails from './pages/FollowDetails.jsx'
import SearchResults from './pages/SearchResults.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: (
                <AuthLayout authentication={false}>
                    <Login />
                </AuthLayout>
            ),
        },
        {
            path: "/edit-profile",
            element: (
                <AuthLayout authentication>
                    <EditProfile />
                </AuthLayout>
            ),
        },
        {
            path: "/signup",
            element: (
                <AuthLayout authentication={false}>
                    <Signup />
                </AuthLayout>
            ),
        },
        {
            path: "/all-posts",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <AllPosts />
                </AuthLayout>
            ),
        },
        {
            path: "/user/:userId",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <UserProfiles />
                </AuthLayout>
            ),
        },

        {
            path: "/my-posts",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <MyPosts />
                </AuthLayout>
            ),
        },
        {
            path: "/add-post",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <AddPost />
                </AuthLayout>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <EditPost />
                </AuthLayout>
            ),
        },
        
        {
            path: "/post/:slug",
            element: <Post />,
        },
        {
            path: "/bookmarks",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <Bookmarks />
                </AuthLayout>
            ),
        },

            {
                path: "/follow-details/:userId",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <FollowDetails />
                    </AuthLayout>
                ),
            },
            {
                path: "/following-details/:userId",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <FollowingUsers />
                    </AuthLayout>
                ),
            },
            {
                path: "/search",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <SearchResults />
                    </AuthLayout>
                ),
            },
    ],
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>

)