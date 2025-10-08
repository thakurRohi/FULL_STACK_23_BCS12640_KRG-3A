
// This is a React component that serves as a layout wrapper with specific styling constraint
import React from 'react'

function Container({children}) {
  return <div className='w-full max-w-7xl mx-auto px-4'>{children}</div>;
  
}

export default Container