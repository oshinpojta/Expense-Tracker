const Membership = require("../models/membership");

class MembershipService{
    
    getMembership = async (userId) => {
        try {
            return await Membership.findAll({ where : { userId : userId}});
        } catch (error) {
            throw error;
        }
    }
    
    updateMembership = async (membership) => {
        try{
            let e = await Membership.findByPk(membership.id);
            if(e){
                return e.update({ 
                    orderId : membership.orderId,
                });
            }
            return e;
        }catch(error){
            throw error;
        }
    }
    
    deleteMembership = async (userId) => {
        try {
            return await Membership.destroy({where : { userId : userId}});
        } catch (error) {
            throw error;
        }
    }

}

module.exports = MembershipService;