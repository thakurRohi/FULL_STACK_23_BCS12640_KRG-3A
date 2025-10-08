import React, { useEffect } from 'react'
import { Container, PostForm } from '../Components'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const { status: isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className='py-8'>
        <Container>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost