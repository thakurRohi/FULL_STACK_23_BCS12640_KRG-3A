import React, {useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import service from "../../appwrite/config";
import { useDispatch, useSelector } from "react-redux";
import { createPost,updatePost } from "../../store/fileThunks"; // Import 
import { useNavigate } from "react-router-dom";

const FORM_STORAGE_KEY = "postFormData";

export default function PostForm({ post }) {
// this is the information that useForm is going to provide
// gives watch capabilities also for continous monitor
// control provided also that further passed to RTE
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
// we take information by making a "post" , on the base of that info we can decide wether the
// user has came to esit ot upload new post
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    
      // Access the loading and error states from Redux
    const { uploadStatus, error: createError } = useSelector(
        (state) => state.file || { uploadStatus: 'idle', error: null }
    );
    
    const isCreating = uploadStatus === 'loading';
    const submit = async (data) => {

      

        // if (post) {
        // // use appwrite service to upload file
        //     const file = data.image[0] ? await service.uploadFile(data.image[0]) : null;
        // // once file is uploaded dedlet the older one
        //     if (file) {
        //         service.deleteFile(post.featuredImage);
        //     }
        // // update the post now by giving data , post.id is slug
     
        //     const dbPost = await service.updatePost(post.$id, {
        //         ...data,
        //            // overwrite featured image
        //         featuredImage: file ? file.$id : undefined,
        //     });
        // // once evrything oden succesfuly navigate user
        //     if (dbPost) {
        //         navigate(`/post/${dbPost.$id}`);
        //     }
        // } 
        // // if there is no post that measn the user wants to create something new
        // //// aslo he doesn have to update anything
        // else {
        //     // so we handle file first
        //     const file = data.image[0] ? await service.uploadFile(data.image[0]) : null;

        //     if (file) {
        //         const fileId = file.$id;
        //         data.featuredImage = fileId;
        //         const dbPost = await service.createPost({
        //              ...data, userId: userData.$id 
        //             });

        //         if (dbPost) {
        //             navigate(`/post/${dbPost.$id}`);
        //         }
        //     }
        // }

        try {
            // Dispatch the update thunk with form data and image
            if (post) {
                // Editing: dispatch updatePost
                const result = await dispatch(
                  updatePost({
                    postId: post.$id,
                    postData: {
                      ...data,
                      userId: userData.$id,
                      featuredImage: data.image?.[0] ? undefined : post.featuredImage, // keep old image if no new one
                    },
                    imageFile: data.image?.[0] || null,
                  })
                ).unwrap();
                if (result && result.$id) {
                    navigate(`/post/${result.$id}`);
                  }
              }

              else {
                // Creating: dispatch createPost
                const result = await dispatch(
                  createPost({
                    postData: {
                      ...data,
                      userId: userData.$id,
                    },
                    imageFile: data.image?.[0] || null,
                  })
                ).unwrap();
                if (result && result.$id) {
                    navigate(`/post/${result.$id}`);
                  }
              }

          } catch (error) {
            // Errors are already handled by the thunk, but you can add additional handling here
            console.error("Post creation failed:", error);
          }

          localStorage.removeItem(FORM_STORAGE_KEY);
    };

    // we have two nput fields , title an dslug , watch tittle sonstantly and convert space
    // to -

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
     // else return empty string
        return "";
    }, []);



    React.useEffect(() => {
        //this varibale could be of any name , basicaly it is used for optimasation of
        // use Effect 
        // lets say we called a method in useEffect now we optimize it by storing in a variale
        // naming subsription or any and at the end unsubsribe it to stop it from getting called
        // in loop
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

        // Restore form data from localStorage on mount
        useEffect(() => {
            const savedData = localStorage.getItem(FORM_STORAGE_KEY);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                // e.g., expire after 1 hour
                if (parsed._ts && Date.now() - parsed._ts < 3600000) {
                    Object.keys(parsed).forEach(key => {
                        if (key !== "_ts") setValue(key, parsed[key]);
                    });
                } else {
                    localStorage.removeItem(FORM_STORAGE_KEY);
                }
            }
        }, [setValue]);

         // Save form data to localStorage on change (debounced)
    useEffect(() => {
        let timeoutId;
        const subscription = watch((value) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ ...value, _ts: Date.now() }));
            }, 500); // Debounce for 500ms
        });
        return () => {
            subscription.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, [watch]);

    useEffect(() => {
        return () => {
            localStorage.removeItem(FORM_STORAGE_KEY);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap flex-col md:flex-row">
            <div className="w-full md:w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-full md:w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" 
                  // Disable during loading
                  disabled={isCreating} >
                    {isCreating ? "Creating..." : post ? "Update" : "Create"}
                </Button>

                  {/* Display error message if any */}
                 {createError && (
                 <div className="text-red-500 mt-2">{createError}</div>
                   )}
            </div>
        </form>
    );
}

