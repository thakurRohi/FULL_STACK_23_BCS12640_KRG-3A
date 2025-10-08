import React, {useEffect} from 'react'
import {Container, PostForm} from '../Components'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostBySlug } from '../store/fileThunks';
import { useNavigate,  useParams } from 'react-router-dom';

function EditPost() {
    const dispatch = useDispatch();
    const {slug} = useParams();
    const navigate = useNavigate();
    const post = useSelector(state => state.file.currentPost);
    const postStatus = useSelector(state => state.file.currentPostStatus);
    const { status: isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (slug) {
            dispatch(fetchPostBySlug(slug));
        } else {
            navigate('/');
        }
    }, [slug, navigate, dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return postStatus === 'succeeded' && post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null;
}

export default EditPost