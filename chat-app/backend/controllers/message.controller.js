const Message = require("../models/Message");
const User = require("../models/User");

//send message
exports.sendMessage = async (req, res) => {
    try{
        const{ receiver, message } = req.body;
        if(!receiver || !message) {
            return res.status(400).json({
                message: "Receiver and message are required",
            });
        }
        const receiverUser = await User.findById(receiver);
        if(!receiverUser){
            return res.status(404).json({
                message: "Receiver not found",
            });
        }
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver,
            message,
        });
        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
        });
    }
};

//get conversation
exports.getConversation = async (req, res) =>{
    try{
        const { userId } = req.params;
        const messages = await Message.find({
            $or: [
                {
                    sender: req.user.id,
                    receiver: userId,
                },
                {
                    sender: userId,
                    receiver: req.user.id,
                },
            ],
        })
        .sort({ createdAt: 1 })
        .populate("sender", "username profileImage")
        .populate("reciver", "username profileImage");
        res.status(200).json(messages);
    } catch(err) {
        consol.error(err);
        res.status(500).json({
            message: err.message,
        });
    }
};

//get all chat of logged user
exports.getMyChats = async (req, res) => {
    try{
        const message = await Message.find({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id },
            ],
        })
        .sort({ createdAt: -1 })
        .populate("sender", "username profileImage")
        .populate("receiver", "username profileImage");
        res.status(200).json(messages);
    }catch (err){
        console.error(err);
        res.status(500).json({
            message:err.message,
        });
    }
};
