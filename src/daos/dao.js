export class DaoMongo {
    constructor(model){
        this.model = model
    }

    getAll  = async ()          => await this.model.find({})
    get     = async (filter)    => await this.model.findOne(filter)
    create  = async ()          =>{} 
    update  = async ()          =>{} 
    delete  = async ()          =>{} 
}


//Este va a ser el dao general para todos mis DAO