import passport from 'passport';
import GithubStrategy from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import usersDaoMongo from '../daos/MONGO/MONGODBNUBE/usersDao.mongo.js';
import { createHash, isValidPassword, generateRandomPassword } from '../utils/bcrypt.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PRIVATE_KEY } from '../utils/jwt.js';

const userService = new usersDaoMongo();

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies) token = req.cookies['token'];
    return token;
}

export const initializePassport = () => {
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            const user = await userService.getUser(jwt_payload.id); // Pasa el id como un objeto
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));
};

// Estrategia de GitHub
passport.use('github', new GithubStrategy({
    clientID: 'Iv23litYUUdGsaaCbXkR',
    clientSecret: '0c9b66b2985d39262164a27194fc882e5f241cba',
    callbackURL: 'http://localhost:8000/api/sessions/githubcallback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userService.getUser({ email: profile._json.email });
        if (!user) {
            // Generar una contraseña aleatoria y su hash
            const randomPassword = generateRandomPassword();
            const hashedPassword = createHash(randomPassword);

            let newUser = {
                first_name: profile.displayName || profile.username || 'N/A',
                last_name: profile.displayName || profile.username || 'N/A',
                email: profile._json.email || 'N/A',
                password: hashedPassword // Almacenar la contraseña hash en la base de datos
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

// Estrategia de registro local
passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        let user = await userService.getUser({ email });
        if (user) {
            return done(null, false, { message: 'Email ya registrado' });
        }

        const hashedPassword = createHash(password);
        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email,
            password: hashedPassword
        };

        let result = await userService.createUser(newUser);
        return done(null, result);
    } catch (err) {
        return done(err);
    }
}));

// Estrategia de login local
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        let user = await userService.getUser({ email });
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        const isValid = isValidPassword(user, password);
        if (!isValid) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await userService.getUser({ _id: id });
        done(null, user);
    } catch (error) {
        done(error);
    }
});