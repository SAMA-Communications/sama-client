import wsNode from "ws"

const WebSocketImp = globalThis.WebSocket ?? wsNode

export default WebSocketImp

