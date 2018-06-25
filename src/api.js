import io from 'socket.io-client';
const socket = io('http://localhost:3100');

function socketDebug(data, cb){
	socket.on("DEBUG", d => {cb(d)})
	socket.emit("DEBUG", data)
}

export {socketDebug}