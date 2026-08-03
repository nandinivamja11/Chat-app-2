// const Group = require("../models/Group");
// const GroupMember = require("../models/GroupMember");
// const User = require("../models/User");
// const GroupMessage = require("../models/GroupMessage");
const { User, Group, GroupMember, GroupMessage } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/db");
exports.createGroup = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("USER:", req.user);

        const name = req.body.name;

let members = req.body.members;

// Agar sirf ek member ho to string aata hai
if (!Array.isArray(members)) {
  members = members ? [members] : [];
}

// Number me convert karo
members = members.map(Number);
        const createdBy = req.user.id;

        if(!name || !members || members.length < 2){
            return res.status(400).json({
                message: "Group name and at least 2 members required",
            });
        }
        const group = await Group.create({
        groupName: name,
        createdBy,
        groupImage: req.file
          ? `/uploads/chat/${req.file.filename}`: null,
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
      include: [
        {
          model: User,
          attributes: ["id", "username", "profileImage"],
        },
      ],
    },
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
    console.error(err);
    console.error(err.message);
    console.error(err.parent);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.sendGroupMessage = async (req, res) => {
  try{
  const { groupId, message, type, fileUrl, fileName, replyTo } = req.body;

  const newMessage = await GroupMessage.create({
    groupId,
    senderId: req.user.id,
    message,
    type: type || "text",
    fileUrl,
    fileName,
    isSeen: false,
    replyTo: replyTo || null,
  });

  const createdMessage = await GroupMessage.findByPk(newMessage.id, {
    include: [
      {
        model: User,
        as: "Sender",
        attributes: ["id", "username"],
      },
      {
        model: GroupMessage,
        as: "ReplyMessage",
        required: false,
        include: [
          {
            model: User,
            as: "Sender",
            attributes: ["id", "username"],
          },
        ],
      },
    ],
  });

  res.json(createdMessage);
} catch (err) {
  console.error(err);
  console.error(err.message);
  console.error(err.parent);
  console.error(err.original);
  return res.status(500).json({
    error: err.message,
  });
 }
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
        {
          model: GroupMessage,
          as: "ReplyMessage",
          required: false,
          include: [
            {
              model: User,
              as: "Sender",
              attributes: ["id", "username"],
            },
          ],
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
    const myId = Number(req.user.id);

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
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.uploadGroupFile = async (req, res) => {
  try {
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({
        message: "Group ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    let type = "file";

    if (req.file.mimetype.startsWith("image")) {
      type = "image";
    } else if (req.file.mimetype.startsWith("video")) {
      type = "video";
    }

    const message = await GroupMessage.create({
      groupId,
      senderId: req.user.id,
      message: req.file.originalname,
      type,
      fileUrl: `/uploads/chat/${req.file.filename}`,
      fileName: req.file.originalname,
    });

    const sender = await User.findByPk(req.user.id, {
      attributes: ["id", "username"],
    });

    return res.json({
      ...message.toJSON(),
      senderName: sender?.username,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};
exports.updateGroupPhoto = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "No image selected",
      });
    }

    const imagePath = `/uploads/chat/${req.file.filename}`;

    await Group.update(
      { groupImage: imagePath },
      {
        where: {
          id: groupId,
        },
      }
    );

    return res.json({
      success: true,
      groupImage: imagePath,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
exports.updateGroupName = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("NAME:", req.body.name);

    const { groupId } = req.params;
    const { name } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    group.groupName = name;

    await group.save();

    res.json({
      success: true,
      group,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.deleteGroupMessage = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  const message = await GroupMessage.findByPk(id);

  if (!message) {
    return res.status(404).json({
      message: "Message not found",
    });
  }

  if (Number(message.senderId) !== Number(req.user.id)) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  if (type === "everyone") {
    message.message = "This message was deleted";
    message.isDeleted = true;
    await message.save();
  } else {
    await message.destroy();
  }

  res.json({
    success: true,
  });
};