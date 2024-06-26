import express from 'express';

import { __dirname } from "./utils/utils.js";
import Handlebars from 'express-handlebars';
import { productsSocket } from './utils/productsSocket.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { initializePassport } from './config/passport.config.js';
import { connectDb, objectConfig } from './config/index.js';
import routerApp from './Routes/index.js';
import fs from 'fs';
import ProductManager from './daos/productDao.FS.js';
import viewsRouter from './Routes/views.router.js';
import { multerSingleUploader } from './utils/multer.js';
import { handleAddProduct } from './utils/crearProducto.js';
import { deleteProduct } from './utils/eliminarProducto.js';
import cors from 'cors';
import dotenv from 'dotenv';

const cartData = JSON.parse(fs.readFileSync(__dirname + '/file/carts.json', 'utf-8'));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const { port } = objectConfig;

// const appUse = midd => {
//     return app.use(mid)
// }

connectDb();
connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Public'));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

dotenv.config();

app.use(cors());

// Sessions con mongo
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://ladrianfer87:u7p7QfTyYPoBhL9j@cluster0.8itfk8g.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0',
        ttl: 60 * 60 * 1000 * 24
    }),
    secret: 's3cr3etc@d3r',
    resave: true,
    saveUninitialized: true
}));

app.use(routerApp);
app.use(passport.session());

app.engine('hbs', Handlebars.engine({
    extname: '.hbs',
    helpers: {
        eq: (a, b) => a === b
    }
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// Routes
app.use('/', viewsRouter);
app.use('/realtimeproducts', viewsRouter);
app.use('/cart', viewsRouter);

app.use('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productsData });
});

app.post('/upload-file', multerSingleUploader, (req, res) => {
    res.send('¡Imagen subida con éxito!');
});

// Endpoint para obtener la configuración
app.get('/api/config', (req, res) => {
    res.json({ port: objectConfig.port });
});

const manager = new ProductManager(`${__dirname}/file/products.json`);

httpServer.listen(port, error => {
    if (error) console.log(error);
    console.log('server escuchando en el puerto' + port);
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('message', (data) => {
        console.log('Mensaje recibido:', data);
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    socket.on('addProduct', (productData) => {
        handleAddProduct(productData, manager, io);
        console.log('datos recibidos desde el cliente', productData);
    });

    socket.on('eliminarProducto', (productId) => {
        deleteProduct(productId, manager, io);
    });
});