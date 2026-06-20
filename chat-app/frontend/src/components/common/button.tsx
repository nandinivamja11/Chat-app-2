type buttonprops={
    text: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
};

function button({
    text, type = "button",
    onClick,
    className="",
}:
buttonprops){
    return(
        <button type={type} onClick={onClick}
        className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${className}`}>
            {text}
        </button>
    );
}   