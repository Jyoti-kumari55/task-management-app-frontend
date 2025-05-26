import React, { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu';

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const inputSelectHandler = (option) => {
        onChange(option);
        setIsSelectOpen(false);
    }
  return (
    <div className='relative w-full'>
    <button className='w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center' 
      onClick={() => setIsSelectOpen(!isSelectOpen)}>
        {value ? options.find((task) => task.value === value)?.label : placeholder}
        <span className='ml-2'>{isSelectOpen ? <LuChevronDown className='rotate-180' /> : <LuChevronDown />}</span>
    </button>
    { isSelectOpen && (
        <div className='absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10 '>
        {options.map((option) => (
            <div className='px-3 py-2 text-sm cursor-pointer hover:bg-gray-100'
            key={option.value}
            onClick={() => inputSelectHandler(option.value)}
            >

            {option.label}
            </div>
        ))}
        </div>
    )}
    </div>
  )
}

export default SelectDropdown
