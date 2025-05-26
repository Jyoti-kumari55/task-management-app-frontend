import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/admin/Dashboard";
import ManageTasks from "./pages/admin/ManageTasks";
import CreateTask from "./pages/admin/CreateTask";
import ManageUsers from "./pages/admin/ManageUsers";
import UserTask from "./pages/user/UserTask";
import ViewTaskDetails from "./pages/user/ViewTaskDetails";
import PrivateRoute from "./role/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import UserReports from "./pages/admin/UserReports";
import UserDashboard from "./pages/user/UserDashboard";
import UserModal from "./components/UserModal";

const App = () => {
  return (
    <>
      <UserProvider>
        <div className="">
          <Router>
            <Routes>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>

              {/*admin role*/}
              <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/tasks" element={<ManageTasks />} />
                <Route path="/admin/create-task" element={<CreateTask />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/users/report" element={<UserReports />} />
                <Route path="/user/profile" element={<UserModal />} />
              </Route>

              {/*User role*/}
              <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/tasks" element={<UserTask />} />
                <Route
                  path="/user/taskDetails/:id"
                  element={<ViewTaskDetails />}
                />
              </Route>
              <Route path="/" element={<Root />} />
            </Routes>
          </Router>
        </div>

        <Toaster
          toastOptions={{ className: "", style: { fontSize: "13px" } }}
        />
      </UserProvider>
    </>
  );
};

export default App;

const Root = () => {
  const { user, error, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }
  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
