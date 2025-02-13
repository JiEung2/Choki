import React from 'react';

const CommonInput = ({
	placeholder,
	value,
	onChange,
	type = 'text',
}: InputProps) => {
	return (
		<input
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			className="
        w-[316px] 
        h-[50px] 
        px-4 
        bg-white 
        rounded-full 
        border 
        border-gray-200
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-200 
        focus:border-transparent
        transition-all
      "
		/>
	);
};

export default CommonInput;
