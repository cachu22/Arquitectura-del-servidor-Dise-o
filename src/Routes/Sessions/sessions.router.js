// session -> login - register - logout
import { Router } from 'express';
import { usersManagerDB } from '../../dao/user.ManagerDB.js';
import { createHash, isValidPassword } from '../../utils/bcrypt.js';
import passport from 'passport';
import { generateToken } from '../../utils/jwt.js';
import { passportCall } from '../../middlewares/passportCall.middleware.js';
import { authorization } from '../../middlewares/Authorization.middleware.js';

export const sessionsRouter = Router();

const userService = new usersManagerDB();

sessionsRouter.get('/github', passport.authenticate('github', { scope: 'user:email' }), async (req, res) => {});

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

// sessionsRouter.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(401).send({ status: 'error', error: 'Se deben completar todos los datos' });
//     }

//     const userFound = await userService.getUserBy({email})

//     if (!userFound) {
//         return res.status(401).send({ status: 'error', error: 'Usuario o contraseña incorrectos' });
//     }

//     if (!isValidPassword(password, { password: userFound.password })) return res.status(401).send({status: 'error', error: 'contraseña incorrecta'})

//     req.session.user = {
//         first_name: userFound.first_name,
//         last_name: userFound.last_name,
//         email: userFound.email,
//         isAdmin: userFound.role === 'admin'
//     };

//     // Establecer una cookie con datos del usuario
//     res.cookie('user', JSON.stringify({
//         email: req.session.user.email,
//         first_name: req.session.user.first_name,
//         last_name: req.session.user.last_name,
//         isAdmin: req.session.user.isAdmin // Cambiado a isAdmin
//     }), { maxAge: 1000000, httpOnly: true });

//     console.log('datos', req.session.user);

//     // Redirigir a la ruta principal
//     res.redirect('/');
// });

// sessionsRouter.post('/register', async (req, res) => {
//     try {

//         const {first_name,  last_name, email, password} = req.body

//         //Validar si vienen los datos
//         if(!email || !password) return res.status(401).send({status: 'error', error: 'Se deben completar todos los datos'})
    
//         //validar si existe el usuario
//         const userExist = await userService.getUserBy({email})
//         if(userExist) return res.status(401).send({status: 'error', error: 'el usuario ya existe'})
    
//             const newUser = {
//                 first_name,
//                 last_name,
//                 email,
//                 password :createHash(password)
//             }
        
//             const result = await userService.createUser(newUser)
//             //Validar
//             console.log(result);
    
//         res.redirect('/')

//     } catch (error) {
//         console.log(error);
//     }
     
// })

sessionsRouter.post('/register', async (req, res) => {
    console.log('Se recibió una solicitud de registro');

    const { first_name, last_name, password, email} = req.body;
    
    //validación
    if(!password || !email) {
        console.log('Error: Faltan credenciales en la solicitud de registro');
        return res.status(401).send({status: 'error', message: 'Debe ingresar todas las credenciales'});
    }

    //revisar si existe el usuario
    console.log('Buscando usuario en la base de datos...');
    const userFound = await userService.getUser({email});

    if(userFound) {
        console.log('Error: El usuario ya existe');
        return res.status(401).send({status: 'error', message: 'El usuario ya existe'});
    }
    
    const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password)
    };

    console.log('Creando un nuevo usuario en la base de datos...');
    const result = await userService.createUser(newUser)

    const token = generateToken({
        id: result._id
    });

    console.log('Usuario registrado exitosamente');
    res
    .cookie('token', token, {
        maxAge: 60*60*1000*24,
        httpOnly: true
    })
    .send({status: 'success', message: 'Usuario registrado exitosamente'});
});

sessionsRouter.post('/failregister', async (req, res) => {
    console.log('falló la estrategia');
    res.send({ error: 'failed' });
});

sessionsRouter.post('/login', async (req, res) => {
    const { password, email } = req.body
    //validación
    if(!password || !email) return res.status(401).send({status: 'error', message: 'debe ingresar todas las credenciales'})
    //revisar si existe el usuario
    const userFound = await userService.getUser({email})

    if (!isValidPassword({password: userFound.password}, password)) return res.status(401).send({status: 'error', message: 'no coinciden las credenciales'})
        
        const token = generateToken({
            email: userFound.email,
            id: userFound._id,
            role: userFound.role
        })
        
    res
        .cookie('token', token, {
        maxAge: 60*60*1000*24,
        httpOnly: true
    })
    .send({status: 'success', message: 'usuario logueado'})
});



//     if (!req.user) return res.status(400).send({ status: 'error', error: 'credenciales invalidas' });
//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         email: req.user.email
//     };
//     res.redirect('/');
// });

sessionsRouter.post('/faillogin', (req, res) => {
    res.send({ error: 'falló el login' });
});

sessionsRouter.get('/current', passportCall('jwt'), authorization('user'), async (req, res) => {
    res.send('datos sensibles')
})

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send({ status: 'error', error: err });
        else return res.redirect('/login');
    });
});

// Ruta para autenticación con GitHub
sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub
sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email
    };
    res.redirect('/'); // Redirige a la página principal o donde desees
});

export default sessionsRouter;