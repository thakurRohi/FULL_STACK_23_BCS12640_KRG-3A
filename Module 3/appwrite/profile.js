import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query, Account } from "appwrite";

export class ProfileService{
    client = new Client();
    databases;
   

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);

    }

        // In your Service class
async createUserProfile({ userId, name, email }) {
    try {
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            userId,
            { userId, name, email }
        );
    } catch (error) {
        console.log("Appwrite service :: createUserProfile :: error", error);
        throw error;
    }
}

    // Get a user's profile
    async getProfile(userId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                userId
            );
        } catch (error) {
            console.log("profileService :: getProfile :: error", error);
            return null;
        }
    }

    async updateProfile(userId, data) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                userId,
                data
            );
        } catch (error) {
            console.log("ProfileService :: updateProfile :: error", error);
            throw error;
        }
    }

    async findProfileByUserId(userId) {
        try {
            if (!userId) throw new Error("userId is required for profile search");
            const result = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                [Query.equal('userId', [userId])] // <-- FIXED HERE
            );
            return result.documents;
        } catch (error) {
            console.log("ProfileService :: findProfileByUserId :: error", error);
            throw error;
        }
    }
    

}

const profileService = new ProfileService();
export default profileService