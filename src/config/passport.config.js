import passport from "passport";
import GithubStrategy from 'passport-github2'
import { usersManagerDB } from "../dao/user.ManagerDB.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

// const LocalStrategy = local.Strategy
const userService = new usersManagerDB()

export const initializePassport = () => {
    passport.use('github', new GithubStrategy({
        clientID: 'Iv23litYUUdGsaaCbXkR',
        clientSecret: '0c9b66b2985d39262164a27194fc882e5f241cba',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.getUserBy({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile.displayName || profile.username || 'N/A',
                    last_name: profile.displayName || profile.username || 'N/A',
                    email: profile._json.email || 'N/A',
                    password: ''
                };
                let result = await userService.createUser(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.getUserBy({ _id: id });
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};