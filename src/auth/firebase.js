import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { clearUser, setUser } from "../features/authSlice";
import {
  toastSuccessNotify,
  toastErrorNotify,
  toastWarnNotify,
} from "../helper/Toastfy";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export default firebase;
export const auth = getAuth(firebase);
export const provider = new GoogleAuthProvider();
export const createUser = async (
  email,
  password,
  navigate,
  displayName,
  dispatch
) => {
  try {
    let userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    //? kullanıcı profilini güncellemek için kullanılan firebase metodu
    await updateProfile(auth.currentUser, {
      displayName: displayName,
    });
    dispatch(
      setUser({
        username: displayName,
        email: email,
      })
    );
    navigate("/login");
    toastSuccessNotify("Kayıt Başarılı...!");
  } catch (error) {
    toastErrorNotify(error.message);
  }
};

export const userObserver = (dispatch) => {
  //? Kullanıcının signin olup olmadığını takip eden ve kullanıcı değiştiğinde yeni kullanıcıyı response olarak dönen firebase metodu
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const { email, displayName } = user;
      dispatch(
        setUser({
          username: displayName,
          email: email,
        })
      );
    } else {
      dispatch(clearUser());
    }
  });
};
export const logOut = (navigate, dispatch) => {
  signOut(auth);
  dispatch(clearUser());
  toastWarnNotify("Çıkış Yapıldı..");
  navigate("/");
};
export const signIn = async (email, password, navigate) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/");
    toastSuccessNotify("Giriş Başarılı...!");
  } catch (error) {
    toastErrorNotify(error.message);
  }
};
export const signUpProvider = (navigate, dispatch) => {
  //? Google ile giriş yapılması için kullanılan firebase metodu
  const provider = new GoogleAuthProvider();
  //? Açılır pencere ile giriş yapılması için kullanılan firebase metodu
  signInWithPopup(auth, provider)
    .then(({ user }) => {
      dispatch(
        setUser({
          username: user.displayName,
          email: user.email,
        })
      );
      navigate("/");
      toastSuccessNotify("Giriş Başarılı...!");
      console.log(user.displayName);
    })
    .catch((error) => {
      toastErrorNotify(error.message);
    });
};

export const signUpProviderFaceBook = (navigate, dispatch) => {
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      dispatch(
        setUser({
          displayName: user.displayName,
          email: user.email,
        })
      );
      navigate("/");

      toastSuccessNotify("Giriş Başarılı...!");
    })
    .catch((error) => {
      toastErrorNotify(error.message);
    });
};
