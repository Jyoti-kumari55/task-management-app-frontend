import React, { useState } from "react";
import { HiOutlineTrash, HiOutlinePlus} from "react-icons/hi";
import { LuPaperclip } from "react-icons/lu";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [options, setOptions] = useState("");

  const addOptionsHandler = () => {
    if (options.trim()) {
      setAttachments([...attachments, options.trim()]);
      setOptions("");
    }
  };

  const optionsDeleteHandler = (index) => {
    const updatedAtt = attachments.filter((__, indx) => indx !== index);
    setAttachments(updatedAtt);
  };

  return (
    <div>
      {attachments.map((todo, index) => (
        <div key={todo} className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2">
          <div className="flex-1 flex items-center gap-3 border border-gray-100">
            <LuPaperclip className="text-gray-400" />
            <p className="text-xs text-black">{todo}</p>
          </div>
          <button className="cursor-pointer" onClick={() => optionsDeleteHandler(index)}>
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3">
          <LuPaperclip className="text-gray-400" />

          <input
            type="text"
            placeholder="Add file link"
            value={options}
            onChange={({ target }) => setOptions(target.value)}
            className="w-full text-[13px] text-black outline-none bg-white py-2 "
          />
        </div>
        <button className="card-btn text-nowrap" onClick={addOptionsHandler}>
          <HiOutlinePlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
