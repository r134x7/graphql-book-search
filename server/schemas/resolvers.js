const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: { // find one user by id or username
        // me: async (parent, { user = null, params }) => {
        //     const foundUser = {
        //         $or: [{ _id: user ? user._id : params.id }, { username: params.username }] };
        //     return User.find(foundUser);
        // },
        me: async (parent, args, context) => { // requires resolver context and the use of the JWT to verify the user is using their account
            if (context.user) {
                return User.findOne({ _id: context.user._id })
            }
            throw new AuthenticationError("Session has expired, please login.")
        },
    },
    Mutation: {
        // saveBook: async (parent, { user, body }) => {
        //     console.log(user);
        //     const updatedUser = await User.findOneAndUpdate(
        //         { _id: user._id },
        //         {$addToSet: { savedBooks: body } },
        //         { new: true, runValidators: true }
        //     );
        //     return updatedUser;
        // },
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {$addToSet: { savedBooks: { ...input } } },
                    { new: true, runValidators: true }
                    );

                    return updatedUser;
            }
            throw new AuthenticationError("Session has expired, please login.");
        },
        // removeBook: async (parent, {user, params}) => {
        //     const updatedUser = await User.findOneAndUpdate(
        //         { _id: user._id },
        //         { $pull: { savedBooks: { bookId: params.bookId } } },
        //         { new: true }
        //     );
        //     return updatedUser;
        // },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("Session has expired, please login.");
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);

            return { user, token };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Bzzzzt... Wrong!")
            };
            
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Bzzzzt... Wrong!")
            };

            const token = signToken(user);
            return { user, token };
        },
    },
};

module.exports = resolvers;