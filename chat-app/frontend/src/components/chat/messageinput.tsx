import { useState } from "react";
function MessageInput(){
    const [message,setMessage] = useState("");
    
    const handleSend= () => {
        if(!message.trim()) return;
        console.log(message);
        setMessage("");
    };
    return (
        <div className="bg-white p-4 border-t p-4 flex items-center gap-3">
            <button className="text-2xl">😊</button>
            <input type="text" placeholder="type a message..."
            value={message} onChange={(e) =>setMessage(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button className="text-2xl"> 📎</button>
            <button onClick={handleSend}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600">
                send
            </button>
        </div>
    );
}
export default MessageInput;
