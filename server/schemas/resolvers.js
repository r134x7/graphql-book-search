const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: { 
        me: async (parent, args, context) => { // requires resolver context and the use of the JWT to verify the user is using their account
            if (context.user) {
                return User.findOne({ _id: context.user._id })
            }
            throw new AuthenticationError("Session has expired, please login.")
        },
    },
    Mutation: {
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {$addToSet: { savedBooks: { ...input } } }, // had to put in the same name as in the queries else a SERVER 500 error occurs
                    { new: true, runValidators: true }
                    );

                    return updatedUser;
            }
            throw new AuthenticationError("Session has expired, please login.");
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } }, // had to put in the same name as in the queries else a SERVER 500 error occurs
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("Session has expired, please login.");
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({username, email, password});
            const token = signToken(user); // creates a JWT and assigns it to the user

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

            const token = signToken(user); // creates a JWT and assigns it to the user
            return { user, token };
        },
    },
};

module.exports = resolvers;