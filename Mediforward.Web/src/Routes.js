import React, { useEffect } from "react";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import { withRouter, useHistory, Redirect } from "react-router-dom";
import withAuth from "@root/src/Components/withAuth";
import { getTheme } from "@root/src/Redux/ActionCreators";
import Loadable from "react-loadable";
import Loader from "@root/src/Components/Atoms/Loader";

const Login = Loadable({
  loader: () => import("@root/src/Pages/Login"),
  loading: Loader,
});

const Register = Loadable({
  loader: () => import("@root/src/Pages/Register"),
  loading: Loader,
});

const Profile = Loadable({
  loader: () => import("@root/src/Pages/Profile"),
  loading: Loader,
});

const Account = Loadable({
  loader: () => import("@root/src/Pages/Account"),
  loading: Loader,
});

const ForgotPassword = Loadable({
  loader: () => import("@root/src/Pages/ForgotPassword"),
  loading: Loader,
});

const Room = Loadable({
  loader: () => import("@root/src/Pages/Room"),
  loading: Loader,
});

const ChatModule = Loadable({
  loader: () => import("@root/src/Components/Molecules/ChatModule"),
  loading: Loader,
});

const Route = Loadable({
  loader: () => import("@root/src/Components/Molecules/ProtectedRoute"),
  loading: () => <></>,
});

const SnackBar = Loadable({
  loader: () => import("@root/src/Components/Atoms/Snackbar"),
  loading: () => <></>,
});

const ChangePassword = Loadable({
  loader: () => import("@root/src/Pages/ChangePassword"),
  loading: () => <></>,
});

const Routes = ({ isAuthorised }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("edfref");
  }, []);
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    dispatch(getTheme(window.location.hostname.replace(".mediforward.in", "")));
  }, []);
  const { userTheme, role } = useSelector((state) => state.user);
  const { CurrentPatientId } = useSelector((state) => state.provider);

  const { loader } = useSelector((state) => state.ui);

  const checkAuthorization = (Comp) => {
    return withRouter(({ history }) => {
      useEffect(() => {
        if (!isAuthorised) history.push("/");
      }, []);
      return isAuthorised ? <Comp /> : "";
    });
  };

  return (
    <>
      <Route exact path="/" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgotpassword" component={ForgotPassword} />
      <Route path="/changepassword/:validationKey" component={ChangePassword} />
      <Route path="/profile" component={Profile} />
      <Route allowedRoles="doctor,admin" path="/account" component={Account} />
      <Route path="/room/:roomId/:roomName" component={Room} />
      <Route
        path="/reload"
        component={() => {
          const { CurrentAppointment, objConnection } = useSelector((state) => state.provider);
          useEffect(() => {
            setTimeout(()=> {
              objConnection.invoke(
                "DoctorJoinedCall",
                JSON.stringify({
                  ParticipantId: CurrentAppointment.PatientId,
                  AppointmentId: CurrentAppointment.AppointmentId,
                  Role: role,
                  RoomId: CurrentAppointment?.RoomId,
                  VoiceCall: CurrentAppointment.voiceCall,
                })
              );
              if (CurrentAppointment) dispatch(push(CurrentAppointment?.room));
            },700)
          }, [CurrentAppointment]);
          return <Loader />;
        }}
      />
      {(role === "patient" || CurrentPatientId) && <ChatModule />}
      <SnackBar />
      {loader && <Loader />}
    </>
  );
};

export default withAuth(Routes);
