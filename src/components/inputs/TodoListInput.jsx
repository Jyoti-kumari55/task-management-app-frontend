import React, { useState } from "react";
import { HiOutlineTrash, HiOutlinePlus  } from "react-icons/hi";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  const addOptionsHandler = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  const optionsDeleteHandler = (index) => {
    const updatedChecklist = todoList.filter((__, indx) => indx !== index);
    setTodoList(updatedChecklist);
  };
  return (
    <div>
      {todoList.map((todo, index) => (
        <div 
          key={todo} 
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2">
          <p className="text-xs text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {todo}
          </p>
          <button className="cursor-pointer" onClick={() => optionsDeleteHandler(index)}>
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter task"
          value={option}
          onChange={({target}) => setOption(target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
        />

        <button className="card-btn text-nowrap" onClick={addOptionsHandler}>
          <HiOutlinePlus  className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
