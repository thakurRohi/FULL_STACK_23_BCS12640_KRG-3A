// controllers/userController.js
import dotenv from 'dotenv'
import { Client, Databases, Storage, Users } from "node-appwrite";

dotenv.config();

// Initialize Appwrite client and Users instance
const client = new Client()
  .setEndpoint(process.env.APPWRITE_URL)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);
const users = new Users(client);

const dbId = process.env.APPWRITE_DATABASE_ID;
const collectionId = process.env.APPWRITE_COLLECTION_ID;
const bucketId = process.env.APPWRITE_BUCKET_ID;

// Controller method to get all users
const getAllUsers = async (req, res) => {
  try {
    // Optionally: Add admin authentication/authorization check here
    const userList = await users.list();
    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await users.get(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    await users.delete(req.params.userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateUserName = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await users.updateName(req.params.userId, name);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Placeholder methods for other routes


export default {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserName
};
