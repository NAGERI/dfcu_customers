import { useState } from "react";
import {
  signInWithGooglePopup,
  signAuthUserWithEmailAndPassword,
} from "../utils/firebase/firebase.utils";
import FormInput from "./form-input";
import "./sign-in-form.styles.scss";
import Button from "components/button/button.component";
const defaultFormFields = {
  email: "",
  password: "",
};
const SignInForm = () => {
  const [formsFields, setFormFields] = useState(defaultFormFields);
  const { password, email } = formsFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };
  const signInWithGoogle = async () => {
    await signInWithGooglePopup();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signAuthUserWithEmailAndPassword(email, password);
      resetFormFields();
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          alert("Wrong Password for email");

          break;
        case "auth/user-not-found":
          alert("No User associated with email");

          break;
        default:
          console.log(error);
      }
      alert(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formsFields, [name]: value });
  };
  return (
    <div className="sign-in-container">
      <h1>Already have an account!</h1>
      <h2>Sign In with your email and password</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          required
          type="email"
          onChange={handleChange}
          name="email"
          value={email}
        />
        <FormInput
          label="Password"
          required
          type="password"
          onChange={handleChange}
          name="password"
          value={password}
        />
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type="button" onClick={signInWithGoogle}>
            Google Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
