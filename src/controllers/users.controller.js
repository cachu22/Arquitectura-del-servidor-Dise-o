import { userService } from "../service/index.js";

class UserController {
    constructor(){
        this.userService = userService;
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.userService.getUsers();
            res.send(users);
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al obtener usuarios' });
        }
    }

    getUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const userFound = await this.userService.getUserById(uid);
            if (!userFound) {
                return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
            }
            res.send({ status: 'success', payload: userFound });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al obtener usuario' });
        }
    }

    createUser = async (req, res) => {
        try {
            const { first_name, last_name, email, password, age } = req.body;
            if (!email || !password) return res.status(400).send({ status: 'error', message: 'Faltan campos' });

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password) // Hashear la contraseña
            };

            const result = await this.userService.createUser(newUser);
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al crear usuario' });
        }
    }

    updateUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const { first_name, last_name, email, age, password, role } = req.body;
            
            if (!first_name && !last_name && !email && !age && !password && !role) {
                return res.status(400).send({ status: 'error', message: 'No hay campos para actualizar' });
            }

            const updatedUser = {};
            if (first_name) updatedUser.first_name = first_name;
            if (last_name) updatedUser.last_name = last_name;
            if (email) updatedUser.email = email;
            if (age) updatedUser.age = age;
            if (password) updatedUser.password = createHash(password);
            if (role) updatedUser.role = role;

            const result = await this.userService.updateUser(uid, updatedUser);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al actualizar usuario' });
        }
    }

    deleteUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const result = await this.userService.deleteUser(uid);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', message: 'Error al eliminar usuario' });
        }
    }
}

export default UserController;