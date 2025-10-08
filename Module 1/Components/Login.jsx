// step 1 , import all requred dependencies
import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
// used for different naming conventions for ease of use and 
//less confusion
import { login as authLogin } from '../store/authSlice'
import {Button, Input, Logo} from "./index"
// dispatch service of redux for context mangament
import {useDispatch} from "react-redux"
// login service of appwrite
import authService from "../appwrite/auth"
// form handling hook of react
import {useForm} from "react-hook-form"

function Login() {
    // step 2 , initialze the methods of dependencies

    const navigate = useNavigate()
    const dispatch = useDispatch()
    // in built methods given by useForm
    const {register, handleSubmit} = useForm()
    // methods for managing errors
    const [error, setError] = useState("")

    // step 3 
    const login=async(data)=>{
        // first make the errors empty in order for best practises
        setError("")
        try {
            // fetch the session and store it in a variable
            const session = await authService.login(data)
            console.log("Session ID:", session.$id);
        // if the session is non null then get current user and 
        // update it in the context
        // after that redirect user to home or root page
            if(session){
                const userData = await authService.getCurrentUser()
                if(userData) {
                    dispatch(authLogin({userData,sessionId: session.$id }))
                    
                    navigate("/")
                } else {
                    setError("Failed to get user data")
                }
            }
        } catch (error) {
            // update state of error
            if (error.message.includes("rate limit")) {
                setError("Too many requests. Please wait a few minutes and try again.");
            } else {
                setError(error.message)
            }
        }
    }

    // here we made use of the universal made components that we made 
    // earlier , we are just resuing them here by providing requried values
    // and class Nmaes they require respectively
    return (
        <div
        className='flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4'
        >
            <div className='mx-auto w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8'>
            <div className="mb-6 flex justify-center">
                        <span className="inline-block w-full max-w-[120px]">
                            <Logo width="100%" />
                        </span>
            </div>
            <h2 className="text-center text-3xl font-bold text-slate-900 mb-2">Sign in to your account</h2>
            <p className="text-center text-slate-600 mb-8">
                        Don&apos;t have any account?&nbsp;
                        <Link
                            to="/signup"
                            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                        >
                            Sign Up
                        </Link>
            </p>
            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
            </div>}
            <form onSubmit={handleSubmit(login)} className='space-y-6'>
                <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true,
                })}
                />
                <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >Sign in</Button>
            </form>
            </div>
        </div>
      )
}

export default Login