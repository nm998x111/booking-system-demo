import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Editor from "./components/Editor";
import Admin from "./components/Admin";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import Staff from "./components/Staff";
import CreateEvent from "./components/CreateEvent";
import Navbar from "./components/Navbar";
import EventViewer from "./components/EventViewer";
import Event from "./components/Event";
import EmptyTest from "./components/EmptyTest";
import EditEvent from "./components/EditEvent";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import { ROLES } from "./config/Roles";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            {/*public routes*/}
            <Route path="login" element={<Login />} />
            <Route path="test" element={<EmptyTest />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            {/*protected routes */}

            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="/" element={<Home />} />
              <Route path="events" element={<EventViewer />} />
              <Route path="event/:eventId" element={<Event />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
              <Route path="editor" element={<Editor />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="admin" element={<Admin />} />
            </Route>
            <Route
              element={
                <RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />
              }
            >
              <Route path="editevent/:eventId" element={<EditEvent />} />
              <Route path="newevent" element={<CreateEvent />} />
              <Route path="staff" element={<Staff />} />
            </Route>
            {/* catch all*/}
            <Route path="*" element={<Missing />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
