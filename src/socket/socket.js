const Message = require("../models/message.model");
const Chat = require("../models/chat.model");

module.exports = (io) => {
  // لحفظ المستخدمين المتصلين
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id); 

    // عندما يسجل المستخدم دخول
    socket.on("user-connected", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // إخبار الآخرين أن المستخدم أونلاين
      socket.broadcast.emit("user-online", userId);
      
      console.log(`User ${userId} is online`);
    });

    // الانضمام إلى غرفة المحادثة
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    // مغادرة غرفة المحادثة
    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
      console.log(`Socket ${socket.id} left chat ${chatId}`);
    });

    // إرسال رسالة
    socket.on("send-message", async (data) => {
      try {
        const { chatId, text, userId } = data;
        
        // حفظ الرسالة في قاعدة البيانات
        const newMessage = await Message.create({
          text,
          userId,
          chatId
        });

        // تحديث آخر رسالة في المحادثة
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: text,
          $push: { messages: newMessage._id }
        });

        // إرسال الرسالة لجميع المستخدمين في الغرفة
        io.to(chatId).emit("receive-message", {
          _id: newMessage._id,
          text: newMessage.text,
          userId: newMessage.userId,
          chatId: newMessage.chatId,
          createdAt: newMessage.createdAt
        });

      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // الكتابة
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("user-typing", { chatId, userId });
    });

    // توقف عن الكتاب
    socket.on("stop-typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("user-stop-typing", { chatId, userId });
    });

    // عند قطع الاتصال
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        socket.broadcast.emit("user-offline", socket.userId);
      }
      console.log("Client disconnected:", socket.id);
    });
  });
};