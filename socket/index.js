import { Server } from 'socket.io'

//tạo server socket
const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

//tạo mảng user
let users = []

/**
 *
 * @param {*} userData dữ liệu từ client gửi xuống
 * @param {*} socketId id của server socket
 */
// tạo user đã login
const addUser = (userData, socketId) => {
    // nếu chưa có user login nào trong thì add user vào mảng
    !users.some((user) => user.sub === userData.sub) && users.push({ ...userData, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

// sau khi đã có user login thì lấy ra user đó
const getUser = (userId) => {
    return users.find((user) => user.sub === userId)
}
// mở socket
io.on('connection', (socket) => {
    console.log('user connected socket io')

    //connect
    socket.on('addUsers', (userData) => {
        addUser(userData, socket.id) // nhận user login từ client
        io.emit('getUsers', users) // gửi user login lên client
    })

    //send message
    socket.on('sendMessage', (data) => {
        // lấy ra user đã login
        const user = getUser(data.receiverId)
        // tạo phòng chat giữa 2 user và gữi message lên client
        io.to(user.socketId).emit('getMessage', data)
    })

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected')
        removeUser(socket.id)
        io.emit('getUsers', users)
    })
})
