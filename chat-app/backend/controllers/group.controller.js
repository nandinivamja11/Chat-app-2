const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
const User = require("../models/User");
const GroupMessage = require("../models/GroupMessage");
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
        groupName: name,
        createdBy,
        });
        console.log("GROUP:", group);

        const allMembers = [...new Set([createdBy, ...members])];
        for (const userId of allMembers) {
  console.log("Adding Member:", userId);

  await GroupMember.create({
    groupId: group.id,
    userId,
  });
}

console.log("All Members Added Successfully");
        res.status(201).json({
            success: true,
            group,
        });
    }catch (err) {
  console.error("CREATE GROUP ERROR:", err);

  res.status(500).json({
    message: err.message,
  });
}
};
exports.getMyGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.findAll({
       include: [
        {
          model: GroupMember,
          as: "Members",
          where: {
            userId: userId,
          },
          include: [User],
        },
      ],
    });

    res.json(groups);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.sendGroupMessage = async (req, res) => {
  const { groupId, message, type, fileUrl, fileName } = req.body;

  const msg = await GroupMessage.create({
    groupId,
    senderId: req.user.id,
    message,
    type: type || "text",
    fileUrl,
    fileName,
  });

  res.json(msg);
};

exports.getGroupMessages = async (req, res) => {
  const messages = await GroupMessage.findAll({
    where: {
      groupId: req.params.groupId,
    },
    order: [["createdAt", "ASC"]],
  });

  res.json(messages);
};