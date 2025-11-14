// this is the code from docs of appwrite in order to implement auth service in our app:-------------------------
// import { Client, Account, ID } from "appwrite";

// const client = new Client()
//     .setProject('<PROJECT_ID>'); // Your project ID

// const account = new Account(client);

// const promise = account.create('[USER_ID]', 'email@example.com', '');

// promise.then(function (response) {
//     console.log(response); // Success
// }, function (error) {
//     console.log(error); // Failure
// });

// but for vendor independency we will write custom code , we will be using classes adn each class has a particualr object
// that can be further used by other methods to access services 
// using classes also provides us abstraction inorder to  hide code and prenting it from injecting in UI

// 1st step
import { Client, Account, ID } from "appwrite";

// required for getting env variables 
import conf from '../conf/conf.js';

//step 2 , create and export a class first

export class AuthService {
    //step4 , create a client by using new () method
    client = new Client();
    account;

    //step 5 , provide env varibles value by using a costructor

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
            
        this.account = new Account(this.client);
            
    }

    // // step 6 , frist line of code will be written to remove vendor dependency , this
    // line or part of code will remain consistent and under the hood worl will remain
    //hidden , also indoependent of the vendor or service used

    //****** 
    //destructure email,password , name from object
    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                try {
                    // Try to log in
                    const session = await this.login({email, password});
                    return { user: userAccount, session: session };
                } catch (error) {
                    // If session already exists, just return the user account
                    if (
                        error.code === 409 &&
                        error.message.includes("session is active")
                    ) {
                        // Get the current session instead
                        const currentSession = await this.getCurrentSession();
                        return { user: userAccount, session: currentSession };
                    }
                    throw error;
                }
            } else {
                return { user: userAccount, session: null };
            }
        } catch (error) {
            throw error;
        }
    }

    // step 8 , create login service by taking refrence from appwrite docs
    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
            
        } catch (error) {
            throw error;
        }
    }

    //step 9 , create a method get current user detail whether he is authorized or not 
    // so as there is no unauthrized access to the webpage
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
            // If user is not authenticated, return null instead of throwing
            if (error.code === 401 || error.message.includes('missing scope')) {
                return null;
            }
            throw error;
        }
    }

    //step 10 , logout method
    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }

    async getCurrentSession() {
      try {
        // This gets the current session for the logged-in user
        const sessions = await this.account.listSessions();
        // Find the current session (usually the last one or the one with current device)
        return sessions.sessions[0]; // or use logic to pick the right one
      } catch (error) {
        return null;
      }
    }


}

//step 3 , create object of class and export it
const authService = new AuthService();
export default authService



