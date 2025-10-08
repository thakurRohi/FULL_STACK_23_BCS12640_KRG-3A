import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../appwrite/config";
import { Button, Container } from "../Components";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostBySlug ,deletePost as deletePostThunk} from '../store/fileThunks';
import Comments from "../Components/Comments";
import { resetComments } from "../store/BackendConfig/commentsSlice";

export default function Post() {
    const dispatch = useDispatch();
    const {slug} = useParams();
    const navigate = useNavigate();
    const post = useSelector(state => state.file.currentPost);
    const postStatus = useSelector(state => state.file.currentPostStatus);
    const { status: isAuthenticated } = useSelector((state) => state.auth);
 
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    const sessionId = useSelector((state) => state.auth.sessionId);
    
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

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);


    const deletePost = () => {
        if (!post) return;
        dispatch(deletePostThunk({ postId: post.$id, featuredImageId: post.featuredImage }))
            .then((action) => {
                if (action.type.endsWith('fulfilled')) {
                    navigate("/");
                }
            });
    };

    if (!isAuthenticated) {
        return <div className="w-full py-16 text-center text-red-600 font-bold">Access Denied: Please log in to view this post.</div>;
    }

    return post ? (
        <div className="py-10 bg-slate-50 min-h-screen">
            <Container>
                <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-0 overflow-hidden flex flex-col relative">
                    <div className="relative w-full h-80 overflow-hidden">
                        <img
                            src={service.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-t-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none"></div>
                        {isAuthor && (
                            <div className="absolute right-6 top-6 z-10 flex flex-col items-end" ref={menuRef}>
                                <Button
                                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onClick={() => setMenuOpen((open) => !open)}
                                    aria-label="Post actions"
                                >
                                    <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>
                                </Button>
                                {menuOpen && (
                                    <div className="mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-2 flex flex-col animate-fade-in">
                                        <Link
                                            to={`/edit-post/${post.$id}`}
                                            className="px-4 py-2 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-t-xl"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
                                            onClick={() => { setMenuOpen(false); deletePost(); }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col p-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">{post.title}</h1>
                        <div className="prose prose-lg max-w-none text-slate-800 browser-css bg-slate-50 border border-slate-200 rounded-xl p-8 mb-2 shadow-sm text-justify leading-relaxed text-[1.25rem]">
                            {parse(post.content)}
                        </div>
                    </div>
                </div>
            </Container>
            <Container>
                <Comments
                    postId={post.$id || post.postId}
                    userId={userData?.$id}
                    sessionId={sessionId}
                />
      
            </Container>
        </div>
    ) : null;
}
