const { Group } = require("../models/Group");
const { GroupMember } = require("../models/GroupMember");

exports.createGroup = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("USER:", req.user);

        const { name, members } = req.body;
        const createdBy = req.user.id;

        if(!name || !members || members.length < 2){
            return res.status(400).json({
                message: "Group name and at least 2 members required",
            });
        }
        const group = await Group.create({
          Name,
          createdBy,
        });
        console.log("GROUP:", group);

        const allMembers = [...new Set([createdBy, ...members])];
        for(const userId of allMembers){
            await GroupMember.create({
                groupId: group.id,
                userId,
            });
        }
        res.status(201).json({
            success: true,
            group,
        });
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message:"server Error",
        }); 
    }
};