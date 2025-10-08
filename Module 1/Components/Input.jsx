import React, {useId} from 'react'
//This is a reusable form input component built with React that provides a flexible and customizable input
//field with label support. It's designed to be used across different forms in the application while
//maintaining consistent styling and behavior.

// for eg
{/* <Input label="Username" />

// With custom type and className
<Input 
  label="Email" 
  type="email" 
  className="custom-class" 
/>

// With additional props
<Input 
  label="Password" 
  type="password" 
  placeholder="Enter your password" 
  required 
/> */}

const Input = React.forwardRef( function Input({
    //Uses React.forwardRef to create a component that can receive and forward refs
   //Includes optional label support
    label,
    type = "text",
    className = "",
    //implements a functional component with destructured props
    ...props
    //Spread operator to accept any other HTML input attributes
}, ref){
    //Uses useId() hook to generate unique IDs for input-label associations
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label 
            className='block text-base font-semibold text-slate-800 mb-2 tracking-wide' 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`w-full px-5 py-4 rounded-xl border border-slate-300 bg-white text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input