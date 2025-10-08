// in this file we are going to build a real time text editor
import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
// this is the functionality provided by react hook form by default
// it provides the control in order to keep track of changes
import {Controller } from 'react-hook-form';
// this conntrol comes from react hook form and responsible to take
// states  to that form 
import appwriteService from '../appwrite/config';

export default function RTE({ name, control, label, defaultValue =""}){
    
    const handleImageUpload = async (blobInfo, progress) => {
        try {
            const file = new File([blobInfo.blob()], blobInfo.filename(), { type: blobInfo.blob().type });
            const uploadedFile = await appwriteService.uploadFile(file);
            
            if (uploadedFile) {
                const imageUrl = appwriteService.getFilePreview(uploadedFile.$id);
                return imageUrl;
            }
        } catch (error) {
            console.error('Image upload failed:', error);
        }
        return '';
    };

    return(
    <div className="w-full px-2 sm:px-4 mx-auto">
         {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

        <Controller
    // conditional endering , if name is prsent already then display it 
    // else write content by default
    name={name || "content"}
    control={control}
    // if there is any change happens then inform me with this field
    render={({field: {onChange}}) => (
        // this is the component that we have to render
        <Editor
        initialValue={defaultValue}
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key"}
        init={{
            initialValue: defaultValue,
            height: 500,
            menubar: true,
            plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
            ],
            toolbar:
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            // Configure image upload
            images_upload_handler: handleImageUpload,
            automatic_uploads: true,
            file_picker_types: 'image',
            // Prevent base64 encoding of images
            images_upload_base_path: '/',
            // Set maximum image dimensions
            image_advtab: true,
            image_dimensions: true,
            image_class_list: [
                {title: 'Responsive', value: 'img-fluid'}
            ],
            // Configure paste behavior to handle images better
            paste_data_images: false,
            paste_as_text: false,
            paste_enable_default_filters: true,
            paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,h4,h5,h6",
            paste_retain_style_properties: "color font-size background-color",
        }}
        onEditorChange={onChange}
        />
    )}
    />



        </div>
    )
        
    

}