// const Group = require("../models/Group");
// const GroupMember = require("../models/GroupMember");
// const User = require("../models/User");
// const GroupMessage = require("../models/GroupMessage");
const { User, Group, GroupMember, GroupMessage } = require("../models");
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
    model: GroupMessage,
    as: "Messages",
    limit: 1,
    separate: true,
    order: [["createdAt", "DESC"]],
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
    isSeen: false,
  });

  res.json(msg);
};

exports.getGroupMessages = async (req, res) => {
  try {
    const messages = await GroupMessage.findAll({
      where: {
        groupId: req.params.groupId,
      },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
exports.markGroupSeen = async (req, res) => {
  try {
    await GroupMessage.update(
      { isSeen: true },
      {
        where: {
          groupId: req.params.groupId,
          senderId: {
            [Op.ne]: req.user.id,
          },
          isSeen: false,
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getGroupUnreadCounts = async (req, res) => {
  try {
    const myId = req.user.id;

    const unread = await GroupMessage.findAll({
      where: {
        senderId: {
          [Op.ne]: myId,
        },
        isSeen: false,
      },
      attributes: [
        "groupId",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["groupId"],
    });

    res.json(unread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};