// import UserDto from "../dtos/users.dto.js"
import { userService } from "../service/index.js"

class UserController {
    constructor(){
        this.userService = userService
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.userService.getUsers()                 
            res.send(users)            
        } catch (error) {
            console.log(error)
        }
    }

    getUser = async (req, res) => {
        const {uid} = req.params
        const userFound = users.find(user => user.id === parseInt(uid))
        res.send({status: 'success', payload: userFound})
        
    }

    createUser = async (req, res) => {
    
        const { first_name, last_name, email, password } = req.body
        if(!email) return res.send({status: 'error', error: 'faltan campos'})
        const newUser = {
            first_name,
            last_name,
            email,
            password
        }
        
    
        const result = await userService.createUser(newUser)
        res.status(200).send({ status: 'success', payload: result })
    }

    updateUser = async (req, res) => {
        const { uid } = req.params
        const { first_name, last_name, email} = req.body
        
        if(!first_name,!last_name, !email) return res.send({status: 'error', error: 'faltan campos'})
      
        const result = await this.userService.updateUser(uid, req.body)
    
        res.send({status: 'success', payload: result})
    
    }

    deleteUser = async (req, res) => {
        const { uid } = req.params
    
        const result = await userModel.deleteOne({_id: uid})
        res.send({status: 'success', payload: result})
    }

}

export default UserController