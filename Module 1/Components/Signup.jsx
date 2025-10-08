import React, {useState} from 'react'
import authService from '../appwrite/auth.js'
import {Link ,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice.js'
import {Button, Input, Logo} from './index.js'
import {useDispatch, useSelector} from 'react-redux'
import {useForm} from 'react-hook-form'
import { registerUserAndCreateProfile } from '../store/profileThunks.js'

function Signup() {

    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const create = async(data) => {
        setError("")
        try {
            const currUserData = await dispatch(registerUserAndCreateProfile(data));
            if (registerUserAndCreateProfile.fulfilled.match(currUserData)) {
                // The session is already created during registration, so we don't need to login again
                dispatch(login({ userData: currUserData.payload.user, sessionId: currUserData.payload.session.$id }));
                navigate("/")
            } else if (registerUserAndCreateProfile.rejected.match(currUserData)) {
                const errorMessage = currUserData.payload || "Registration failed";
                if (errorMessage.includes("rate limit")) {
                    setError("Too many requests. Please wait a few minutes and try again.");
                } else {
                    setError(errorMessage);
                }
            }
        } catch (error) {
            if (error.message.includes("rate limit")) {
                setError("Too many requests. Please wait a few minutes and try again.");
            } else {
                setError(error.message)
            }
        }
    }

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
            <div className='mx-auto w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8'>
                <div className="mb-6 flex justify-center">
                    <span className="inline-block w-full max-w-[120px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-3xl font-bold text-slate-900 mb-2">Sign up to create account</h2>
                <p className="text-center text-slate-600 mb-8">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>}
                <form onSubmit={handleSubmit(create)} className='space-y-6'>
                    <Input
                        label="Full Name: "
                        placeholder="Enter your full name"
                        {...register("name", { required: true })}
                    />
                    <Input
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) =>
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                            }
                        })}
                    />
                    <Input
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", { required: true })}
                    />
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    )


}
export default Signup