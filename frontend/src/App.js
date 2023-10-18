import {
  Album,
  CallbackComponent,
  Uploader,
  Test,
  AlbumGrid,
  AlbumMode,
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
              {/* <Route element={<CreateAlbum/>} path='/accounts/:accountId/studiospace'/> */}
            </Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/albums/:albumId" element={<SingleAlbumView />} />
            <Route path="/albums" element={<CreateAlbum />} />
            {/* <Route path="/test" element={<SingleAlbumView />} /> */}
            <Route path="/auth" element={<AuthRequest />} />

            <Route
              path="/accounts/:accountId/studiospace"
              element={<Studiospace />}
            />
            <Route path="/callback" element={<CallbackComponent />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
