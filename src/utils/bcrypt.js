import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';

// Función para generar una contraseña aleatoria
export const generateRandomPassword = () => randomBytes(8).toString('hex');

// Función para crear un hash de la contraseña
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Función para validar la contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);