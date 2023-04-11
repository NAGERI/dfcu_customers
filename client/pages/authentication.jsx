import SignInForm from "./sign-in.form";
import SignUpForm from "./sign-up-form";

import "./authentication.styles.scss";
const Authentication = () => {
  /**
   * 
    useEffect(async () => {
    const response = await getRedirectResult(auth);
    if (response) {
      const userDocRef = await createUserDocumentFromAuth(response.user);
    }
  }, []);
  */

  return (
    <div className="authentication-container">
      <SignInForm />
      <SignUpForm />
    </div>
  );
};

export default Authentication;
