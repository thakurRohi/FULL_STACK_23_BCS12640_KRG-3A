import React from 'react'
import {Container, Logo, LogoutBtn, ProfileComponent, SearchBar} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  // we are checking whether the user is authenticated or not
  // and further on the basis of that we can do a conditional 
  // rendering on the logout button , whento show it
  
  //fetch auth status of current user by using useSelector method
  // of redux toolkit and store it in a variable
  const authStatus = useSelector((state)=>state.auth.status)
  const userData = useSelector((state)=>state.auth.userData)
  const navigate = useNavigate()

  // step 3 for items presnt in navbar we do a loop on an array 
  // of items for navigation

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
    name: "Bookmarks",
    slug: "/bookmarks",
    active: authStatus,
},
  {
    name: "My Posts",
    slug: "/my-posts",
    active: authStatus,
},
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]

  return (
    <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'>
      <Container>
        <nav className='flex items-center justify-between py-4'>
          <div className='flex items-center'>
            <Link to='/' className='hover:opacity-80 transition-opacity'>
              <Logo width='70px' />
            </Link>
          </div>

          {/* Search Bar - Only show for authenticated users */}
          {authStatus && (
            <div className='flex-1 max-w-md mx-8'>
              <SearchBar placeholder="Search posts..." />
            </div>
          )}

{/* mapped all array items along with their urls and their authStatus 
based on useState value of authentication */}
          <ul className='flex items-center space-x-2'>
            {navItems.map((item) => 
// did a conditional rendering on the basis of their true value 
// in active status being not authenticated
//
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                className='inline-block px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200'
                >{item.name}</button>
              </li>
            ) : null
            )}

{/* if you are authenticated then show profile and logout button */}
            {authStatus && (
              <div className="flex items-center space-x-3">
                <ProfileComponent userId={userData?.$id} />
                <LogoutBtn />
              </div>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header