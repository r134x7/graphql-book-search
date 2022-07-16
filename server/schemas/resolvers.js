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
        saveBook: async (parent, { user, body }) => {
            console.log(user);
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                {$addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        },
        deleteBook: async (parent, {user, params}) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
            );
            return updatedUser;
        },
    },
};

module.exports = resolvers;