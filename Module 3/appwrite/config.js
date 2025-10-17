// creayed methods similar to auth for the purpose of interaction 
// with databse and buckets

import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query, Account } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    users;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
        this.users = new Account(this.client);
    }



    // slug acts like an unique id
    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
            throw error; 
        }
    }

    // if we want to update a particular post then it is uniquely accesed
    //by slug and update the other things
    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,

                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getUserPosts(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal("userId", userId),
                    Query.equal("status", "active"),
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getUserPosts :: error", error);
            return false;
        }
    }

    //we are trying to get posts with status active
    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // Search posts by title, content, or author
    async searchPosts(searchTerm, filters = []) {
        try {
            // First, try to get all active posts
            const allPosts = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("status", "active")]
            );

            if (!allPosts || !allPosts.documents) {
                return { documents: [], total: 0 };
            }

            // Filter posts on the client side for better search
            const searchLower = searchTerm.toLowerCase();
            const filteredPosts = allPosts.documents.filter(post => {
                const titleMatch = post.title && post.title.toLowerCase().includes(searchLower);
                const contentMatch = post.content && post.content.toLowerCase().includes(searchLower);
                return titleMatch || contentMatch;
            });

            return {
                documents: filteredPosts,
                total: filteredPosts.length
            };
        } catch (error) {
            console.log("Appwrite service :: searchPosts :: error", error);
            return { documents: [], total: 0 };
        }
    }

    // Search posts by author name (requires joining with user profiles)
    async searchPostsByAuthor(authorName) {
        try {
            // First, find users with matching names
            const userQueries = [
                Query.search("name", authorName)
            ];
            
            // This would require a separate users collection
            // For now, we'll search in post content and title
            const queries = [
                Query.equal("status", "active"),
                Query.search("title", authorName)
            ];
            
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: searchPostsByAuthor :: error", error);
            return false;
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serice :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

     getFilePreview(fileId){
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        )
    }
    


    // Get current user details

}

const service = new Service()
export default service


