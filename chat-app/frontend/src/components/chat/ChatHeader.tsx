function ChatHeader(){
    const user = {
        name:"Ailce",
        status:"online",
    };
    return(
        <div className="bg-white p-4 border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
            </div>
        <div>
            <h2 className="font-semibold text-lg">{user.name} </h2>
            <p className="text-sm text-green-500">{user.status}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-blue-500">📞</button>
            <button className="text-gray-600 hover:text-blue-500">🎥</button>
            <button className="text-gray-600 hover:text-blue-500">⋮</button>
        </div>
    </div>
    );
} 
export default ChatHeader;