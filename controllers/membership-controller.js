const MembershipService = require("../services/membership-services");
const razorpay = require("razorpay");

let instance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
});

let paymentOptions = {
    amount: 50000,  // amount in the smallest currency unit
    currency: "INR",
    payment_capture : "1"
}

const membershipService = new MembershipService();
//Membership needs to associate with user (one to many)--- also get userId from req.user
exports.getMembershipByUser = async (req, res, next) => {
    try{
        let userId = req.user.id;
        //console.log(userId);
        let memberships = await membershipService.getMembership(userId);
        //console.log(memberships);
        if(memberships.length>0){
            res.json({success:true});
        }else{
            res.json({success : false});
        }
    }catch(err){
        console.log(err);
        res.status(401).json({success : false});
    }
};

exports.createOrder = async (req, res, next) => {
    try{
        let order = await instance.orders.create(paymentOptions);
        console.log(order);
        res.json({success: true, data: order});

    }catch(error){
        console.log(error);
        res.json({success : false});
    }

}

exports.addMembership = async (req, res, next) => {
    try {
        let body = req.body;
        console.log(body);
        let result = await req.user.createMembership({ 
            orderId : body.razorpay_order_id,
            paymentId : body.razorpay_payment_id,
            signature : body.razorpay_signature,
            isMember : true
        });
        console.log(result);
        res.json({success : true});
        
    } catch (error) {
        console.log(error);
        res.status(404).json({ success : false });
    }
}

exports.updateMembership = async (req, res, next) => {
    try {
        let membership = req.body;
        let result = await membershipService.updateMembership(membership);
        //console.log(result);
        res.json({success : true, data : result});
    } catch (error) {
        console.log(error);
        res.status(404).json({success : false});
    }

}

exports.deleteMembership = async (req, res, next) => {
    try {
        let userId = req.user.id;
        let result = await membershipService.deleteMembership(userId);
        res.json({success : true, data : result});
    } catch (error) {
        console.log(error);
        res.status(401).json({success : false});
    }
}