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
} from "./pages";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { UserProvider } from "./context/usercontext";
import PrivateRoute from "./util/PrivateRoute";
import SingleAlbumView from "./pages/SingleAlbumView";

const theme = createTheme({
  typography: {
    fontFamily: "Hanken Grotesk, sans-serif",
  },
});


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Main />} />
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
