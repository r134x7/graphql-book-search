import { User, Book, Auth } from "../models";

const resolvers = {
    Query: { // find one user by id or username
        user: async (parent, { user = null, params }) => {
            const foundUser = {
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }] };
            return User.find(foundUser);
        },
    },
    Mutation: {
        
    }
}