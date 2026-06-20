type MessageBubbleprops = {
    text: string;
    sender: string;
    time: string;
};
function MessageBubble({text,sender,time}:MessageBubbleprops)
{
    return(
        <div className={`flex ${sender === "me" 
            ? "justify-end"
            : "justify-start"
        }`}
        >
            <div className={`max-w-xs px-4 py-2 rounded-lg ${
                sender === "me"
                ? "bg-blue-500 text-white"
                : "bg-white border"
            }`}
            >
            <p className={`text-xs mt-1 text-right ${
                sender === "me"
                ? "text-blue-100"
                : "text-gray-500"
            }`}
            >
                {time}
            </p>
        </div>
        </div>
    );
}
export default MessageBubble;