// session -> login - register - logout
import { Router } from 'express';
import usersManagerDB from '../../daos/usersDao.mongo.js';
import CartManagerDB from '../../daos/cartsDao.mongo.js';
import { createHash, isValidPassword } from '../../utils/bcrypt.js';
import passport from 'passport';
import { generateToken } from '../../utils/jwt.js';
import { passportCall } from '../../middlewares/passportCall.middleware.js';
import { authorization } from '../../middlewares/Authorization.middleware.js';

export const sessionsRouter = Router();

const userService = new usersManagerDB();

const cartService = new CartManagerDB

sessionsRouter.get('/github', passport.authenticate('github', { scope: 'user:email' }), async (req, res) => {});

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

sessionsRouter.post('/register', async (req, res) => {
    console.log('Se recibió una solicitud de registro');

    const { first_name, last_name, password, email, age } = req.body;

    // Validación de campos obligatorios
    if (!password || !email) {
        console.log('Error: Faltan credenciales en la solicitud de registro');
        return res.status(401).send({ status: 'error', message: 'Debe ingresar todas las credenciales' });
    }

    try {
        // Verificar si ya existe un usuario con el mismo email
        console.log('Buscando usuario en la base de datos...');
        const userFound = await userService.getUser({ email });

        if (userFound) {
            console.log('Error: El usuario ya existe');
            return res.status(401).send({ status: 'error', message: 'El usuario ya existe' });
        }

        // Crear un nuevo carrito para el usuario
        const newCart = await cartService.createCart();

        // Preparar nuevo usuario con referencia al carrito
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            cart: newCart._id, // Asignar el ID del carrito creado
            password: createHash(password)
        };

        // Crear el usuario en la base de datos
        console.log('Creando un nuevo usuario en la base de datos...');
        const result = await userService.createUser(newUser);

        // Generar token JWT para el usuario registrado
        const token = generateToken({ id: result._id });

        console.log('Usuario registrado exitosamente');
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true })
           .send({ status: 'success', message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send({ status: 'error', message: 'Error al registrar usuario' });
    }
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
    .send({status: 'success', message: 'Te has logueado correctamente!'})
});

sessionsRouter.post('/faillogin', (req, res) => {
    res.send({ error: 'falló el login' });
});

sessionsRouter.get('/current', passportCall('jwt'), authorization('admin'), async (req, res) => {
    res.send(req.user); // Devuelve los datos del usuario asociado al token
});

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