import React, { useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  //new
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const defaultImage = "https://www.freepik.com/free-vector/businessman-character-avatar-isolated_6769264.htm#fromView=keyword&page=1&position=4&uuid=c7f6f4d2-b573-45e8-98d0-a39c3591acfa&query=Default+User";

  const navbarNameClickHandler = () => {
    // navigate("/user/dashboard");
    window.location.reload();
  };

  const showUserModalHandler = () => {
    navigate("/user/profile");
  }
  const [showUserModal, setShowUserModal] = useState(false);
  return (
    // <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
    //   <button
    //     className="block lg:hidden text-black"
    //     onClick={() => setOpenSideMenu(!openSideMenu)}
    //   >
    //     {openSideMenu ? (
    //       <HiOutlineX className="text-2xl" />
    //     ) : (
    //       <HiOutlineMenu className="text-2xl" />
    //     )}
    //   </button>

    //   <h2 className="text-lg font-medium text-black">Assignado</h2>
    //   {/* new */}

    //   {openSideMenu && (
    //     <div className="fixed top-[61px] -ml-4 bg-white">
    //       <SideMenu activeMenu={activeMenu} />
    //     </div>
    //   )}
    // </div>

    <div className="bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="block lg:hidden text-black"
            onClick={() => setOpenSideMenu(!openSideMenu)}
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>
          <h2 className="text-lg font-medium text-black">Assignado</h2>
          {user?.role === "admin" ? (
            <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
              Admin
            </div>
          ) : (
            <div
              className="text-[10px] font-semibold text-black px-3 py-1 rounded mt-1 hover:bg-gray-200 cursor-pointer"
              onClick={navbarNameClickHandler}
            >
              {user?.name || ""}
            </div>
          )}
        </div>

        <div>
          <img
            src={user?.profileImageUrl || defaultImage}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover bg-slate-400"
            onClick={showUserModalHandler}
          />
        </div>
      </div>
{/* 
      <div>
        {showUserModal && (
          <div className=" flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
              <button
                className="absolute top-2 right-3 text-xl"
                onClick={() => setShowUserModal(false)}
              >
                <HiOutlineX />
              </button>

              <h3 className="text-lg font-semibold mb-4">Update Profile</h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowUserModal(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.profileImageUrl}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div> */}

      {openSideMenu && (
        <div className="fixed top-[61px] left-0 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
