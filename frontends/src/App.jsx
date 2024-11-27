import {
  CallbackComponent,
  Test
} from "./components";
import {
  Main,
  Login,
  SignUp,
  Studiospace,
  CreateAlbum,
  AuthRequest,
  Achievements,
} from "./pages";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { UserProvider } from "./context/usercontext";
import PrivateRoute from "./util/PrivateRoute";
import SingleAlbumView from "./pages/SingleAlbumView";
import {Toaster} from 'sonner';
// import { useEffect } from "react";

const theme = createTheme({
  typography: {
    fontFamily: "Hanken Grotesk, sans-serif",
  },
});




function App() {

  const userExists = window.localStorage.getItem("user");
  const accountId = userExists ? JSON.parse(userExists)?.userID : null;


  return (
    <UserProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
        <Toaster richColors/>
          <Routes>
            <Route path="/" element={accountId ? (<Navigate to={`/accounts/${accountId}/studiospace`} />) : (<Main />)} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route
                element={<Studiospace />}
                path="/accounts/:accountId/studiospace"
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                element={<SingleAlbumView />}
                path="/albums/:albumId"
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                element={<CreateAlbum />}
                path="/albums"
              />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                element={<Achievements />}
                path="/achievements"
              />
            </Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/test" element={<Test />} />
            <Route path="/auth" element={<AuthRequest />} />
            <Route path="/callback" element={<CallbackComponent />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
