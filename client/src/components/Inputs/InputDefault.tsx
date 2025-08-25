import React from "react";
import { ContentCopy } from "@mui/icons-material";

interface InputDefaultProps {
    customClasses?: string;
    label?: string;
    type?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    isCopiable?: boolean;
    maxLength?: number;
}

const InputDefault: React.FC<InputDefaultProps> = ({
    customClasses = "",
    label,
    type,
    name,
    value,
    onChange,
    placeholder = "",
    required,
    disabled,
    isCopiable,
    maxLength
}) => {
    const handleCopy = () => {
        if (isCopiable && navigator.clipboard) {
            navigator.clipboard.writeText(value).then(() => {
                alert("Copied: " + value)
            });
        }
    };

    return (
        <div className={`relative ${customClasses}`}>
            <label className="mb-3 block text-body-sm font-medium">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    maxLength={maxLength}
                    className={`w-full ${isCopiable && 'pr-10'} p-2 pl-4 outline-none border border-gray-400 rounded-sm`}
                />
                {isCopiable && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:cursor-pointer"
                    >
                        <ContentCopy />
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputDefault;