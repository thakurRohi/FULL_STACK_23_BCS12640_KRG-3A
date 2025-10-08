// Main purpose of creating this file is for the security of routes
// Making restrictions on who can access the pages, i.e.
// only authenticated users can access

import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

// We are taking authentication as true by default because sometimes
// user does not send authentication status
// as a result, we took its default value as true

// children represents the components that will be rendered inside this wrapper
export default function Protected({children, authentication = true}) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        //TODO: make it more easy to understand

        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }
        
        //let authValue = authStatus === true ? true : false

        if(authentication && authStatus !== authentication){
            navigate("/login")
        } else if(!authentication && authStatus !== authentication){
            navigate("/")
        }
        setLoader(false)


    },[authStatus, navigate, authentication])

    return loader ? <h1>Loading...</h1> : <>{children}</>
}