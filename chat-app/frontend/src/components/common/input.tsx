type InputProps = {
    label?: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
    className?:string;
};

function Input({
    label,
    type = "text",
    placeholder, value, onChange, className = "",}:
    InputProps) {
        return(
            <div>
                {label && (
                    <label className="block mb-1 font-medium">
                        {label}
                    </label>
                )}
                <input type={type} placeholder={placeholder}
                value={value} onChange={onChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}/>

            </div>
        );
    }
export default Input;