import React, { useState } from "react";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { loginBox } from "../../styles/animations/AuthForm";
import { setChats } from "../../store/Conversations";
import { setSelectedConversation } from "../../store/SelectedConversation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { motion as m } from "framer-motion";

import "../../styles/AuthForm.css";

import { ReactComponent as HidePassword } from "./../../assets/icons/authForm/HidePassword.svg";
import { ReactComponent as ShowPassword } from "./../../assets/icons/authForm/ShowPassword.svg";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [passwordType, setPasswordType] = useState("password");
  const [loader, setLoader] = useState(false);
  const onSubmit = async (data) => {
    setLoader(true);
    try {
      const userToken = await api.userLogin(data);
      localStorage.setItem("sessionId", userToken);
      navigate("/main");
      dispatch(setSelectedConversation({}));
      dispatch(setChats([]));
    } catch (error) {
      localStorage.clear();
      alert(error.message);
    }
    setLoader(false);
  };
  const renderErrorMessage = (err) => <div className="error">{err}</div>;

  const renderForm = (
    <div className="login-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <input
            {...register("ulogin", {
              required: "* Username is require field",
              // pattern: /^[a-z0-9._%+-]$/,
            })}
            placeholder=" "
            type={"text"}
            autoComplete="off"
            autoFocus
          />
          <span className="input-placeholder">Username</span>
          <span className="input-border-focus"></span>
          {errors.ulogin?.message && renderErrorMessage(errors.ulogin.message)}
        </div>
        <div className="input-container">
          <input
            {...register("pass", {
              required: "* Password is require field",
              // minLength: 8,
            })}
            placeholder=" "
            type={passwordType}
            autoComplete="off"
          />
          <span className="password-visibility">
            {passwordType === "password" ? (
              <HidePassword onClick={() => setPasswordType("text")} />
            ) : (
              <ShowPassword onClick={() => setPasswordType("password")} />
            )}
          </span>
          <span className="input-placeholder">Password</span>
          <span className="input-border-focus"></span>
          {errors.pass?.message && renderErrorMessage(errors.pass.message)}
        </div>
        <input type="submit" value="Log in" />
        <div className="button-container">
          New to app?&nbsp;
          <Link to={`/signup`} className="btn-signup">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );

  const exitOptions = { opacity: 0, transition: { duration: 0.25 } };
  const textViewOptions = { strokeDashoffset: 0, opacity: 1 };

  return (
    <div className="login-container">
      <m.div
        variants={loginBox}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="login-box"
      >
        <div className="login-box-left bg-login">
          <div className="logo-icon">
            <svg
              id="logo-icon-line"
              width="104"
              height="181"
              viewBox="0 0 104 181"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <m.path
                initial={{
                  strokeDasharray: "983px",
                  strokeDashoffset: "983px",
                }}
                animate={{
                  ...textViewOptions,
                  transition: { delay: 0.72, duration: 2.1 },
                }}
                exit={exitOptions}
                d="M41.3071 129.733C41.3071 129.733 37.332 142.639 37.2525 142.798C37.173 142.957 37.2525 127.901 37.2525 127.901L26.9174 123.52L13.0842 136.584L15.9462 151.083L41.9431 166.139L62.3749 160.005L74.3796 142.479L73.4256 122.883L61.4209 102.967L38.286 88.3093L11.4942 74.8465L1 52.8598L9.26812 26.5714L29.4614 14.3035L48.5417 9.76279L63.4879 14.3832L68.735 6.81531H78.9078L90.7568 1L98.9454 1.31865L102.761 6.417C102.761 6.417 98.1504 25.8545 97.9914 26.1731C97.8324 26.4918 100.297 6.417 100.297 6.417H97.7529C97.7529 6.417 94.2549 27.6867 94.2549 27.2087C94.2549 26.7308 94.4934 14.2239 94.4934 14.2239L77.3211 30.2359L84.8737 38.68C84.8737 38.68 85.1122 32.785 85.1917 33.1037C85.2712 33.4223 87.4178 46.793 87.4178 46.793L88.3718 46.4706V32.1478C88.3718 31.4308 90.9158 45.6106 90.9158 45.6106V49.1954L84.3172 51.3462L64.4419 40.4326L43.6921 27.846L28.2689 37.8037L25.8839 50.7886L32.4825 65.287L52.2783 74.0498L75.8106 81.3787L95.6064 102.33L103 127.742L98.7864 154.827L83.9992 172.432L64.9189 179.124L42.4201 180L16.9797 173.229L2.66952 155.862L1.39751 137.381L8.71161 125.033L23.3398 120.015L37.2525 123.998L41.3071 129.733Z"
                stroke="white"
              />
            </svg>
            <svg
              id="logo-icon-fill"
              width="104"
              height="181"
              viewBox="0 0 104 181"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <m.path
                initial={{
                  strokeDasharray: "300px",
                  strokeDashoffset: "300px",
                }}
                animate={{
                  ...textViewOptions,
                  transition: { delay: 2.6, duration: 2 },
                }}
                exit={exitOptions}
                d="M41.3071 129.733L37.2525 127.901M37.2525 123.998L26.9174 123.52M8.71161 125.033L14.0382 126.308M1.39751 137.381L14.0382 126.308M1.39751 137.381L8.23461 136.425M1.39751 137.381L11.5737 152.657M2.66952 155.862L11.5737 152.657M16.9797 173.229L22.3063 162.554M16.9797 173.229L11.5737 152.657M16.9797 173.229L41.9431 166.139M83.9992 172.432H66.032M98.7864 154.827L81.4552 155.464M103 127.742L87.2588 129.972M95.6064 102.33L80.1037 108.225M75.8106 81.3787L65.1574 89.5042M52.2783 74.0498L43.5331 80.6618M32.4825 65.287L22.0678 69.1905M25.8839 50.7886L14.5152 51.1073M28.2689 37.8037L20.0008 33.741M84.3172 51.3462V47.8411M90.9158 45.6106L88.3718 46.4706L87.4178 46.793L84.3172 47.8411M84.8737 38.68L84.3172 47.8411M94.4934 14.2239L94.8114 6.417M97.7529 6.417H94.8114M100.297 6.417H102.761M48.5417 9.76279L53.8683 19.5612M29.4614 14.3035L20.0008 33.741M29.4614 14.3035L53.8683 19.5612M29.4614 14.3035L32.1645 24.9782M9.26812 26.5714L20.0008 33.741M1 52.8598L14.5152 51.1073M1 52.8598L22.0678 69.1905M1 52.8598L20.0008 33.741M11.4942 74.8465L22.0678 69.1905M38.286 88.3093L43.5331 80.6618M38.286 88.3093L65.1574 89.5042M38.286 88.3093L22.0678 69.1905M61.4209 102.967L65.1574 89.5042M73.4256 122.883L87.2588 129.972M73.4256 122.883L80.1037 108.225M73.4256 122.883L65.1574 89.5042M74.3796 142.479L81.4552 155.464M74.3796 142.479L66.032 172.432M74.3796 142.479L87.2588 129.972M62.3749 160.005L66.032 172.432M41.9431 166.139L22.3063 162.554M41.9431 166.139L42.4201 180L66.032 172.432M41.9431 166.139L66.032 172.432M15.9462 151.083L11.5737 152.657M13.0842 136.584L8.23461 136.425M26.9174 123.52L23.3398 120.015L14.0382 126.308M26.9174 123.52L14.0382 126.308M14.0382 126.308L8.23461 136.425M8.23461 136.425L11.5737 152.657M11.5737 152.657L22.3063 162.554M66.032 172.432L81.4552 155.464M81.4552 155.464L87.2588 129.972M87.2588 129.972L80.1037 108.225M80.1037 108.225L65.1574 89.5042M65.1574 89.5042L43.5331 80.6618M43.5331 80.6618L22.0678 69.1905M22.0678 69.1905L14.5152 51.1073M14.5152 51.1073L20.0008 33.741M20.0008 33.741L32.1645 24.9782M53.8683 19.5612L43.6921 27.846L32.1645 24.9782M53.8683 19.5612L32.1645 24.9782M53.8683 19.5612L63.4879 14.3832L70.7225 10.8325M53.8683 19.5612L64.9189 27.1291M53.8683 19.5612L64.4419 40.4326L64.9189 27.1291M68.735 6.81531L70.7225 10.8325M78.9078 6.81531L70.7225 10.8325M64.9189 27.1291L84.3172 47.8411M64.9189 27.1291L90.7568 1L94.8114 6.417M64.9189 27.1291L94.8114 6.417"
                stroke="white"
              />
            </svg>
          </div>
          <m.svg
            id="logo-text"
            initial={{ fill: "rgba(255, 255, 255, 0)" }}
            animate={{ fill: "rgba(255, 255, 255, 1)" }}
            transition={{ delay: 2.4, duration: 1 }}
            width="297"
            height="133"
            viewBox="0 0 297 133"
            xmlns="http://www.w3.org/2000/svg"
          >
            <m.path
              initial={{
                strokeDasharray: "2078px",
                strokeDashoffset: "2078px",
              }}
              animate={{
                ...textViewOptions,
                transition: { delay: 0.72, duration: 4.2 },
              }}
              exit={exitOptions}
              d="M1.35082 129.375L1.37829 129.32L1.39646 129.262L40.4565 3.08163L40.4626 3.06184L40.4676 3.04174C40.6796 2.19391 41.0166 1.74453 41.3859 1.52297C41.8658 1.235 42.3918 1.08984 42.98 1.08984C43.5178 1.08984 44.0149 1.26421 44.4915 1.6455L44.5535 1.69513L44.6246 1.73066C45.1393 1.98804 45.4911 2.40875 45.6789 3.06588L45.6808 3.07284L45.683 3.07976L84.383 129.26L84.4013 129.319L84.4292 129.375C84.4825 129.482 84.53 129.658 84.53 129.94C84.53 130.221 84.4273 130.547 84.14 130.93C83.8518 131.314 83.4576 131.667 82.9398 131.981C82.5813 132.155 82.1662 132.25 81.68 132.25C81.2476 132.25 80.7911 132.125 80.3016 131.838C80.0104 131.607 79.7292 131.182 79.5211 130.454L79.5188 130.445L79.5162 130.437L70.3362 100.917L70.1722 100.39H69.62H15.98H15.4246L15.2626 100.921L6.2626 130.441L6.26249 130.441L6.25886 130.454C6.05754 131.158 5.733 131.577 5.33413 131.817C4.85419 132.105 4.32821 132.25 3.74 132.25C3.38871 132.25 2.95488 132.163 2.42789 131.955C2.06789 131.772 1.75311 131.552 1.47999 131.296C1.33046 130.957 1.25 130.569 1.25 130.12C1.25 129.678 1.30918 129.459 1.35082 129.375ZM17.2437 94.4376L16.942 95.4099H17.96H67.64H68.6536L68.3572 94.4405L43.6972 13.8005L42.9852 11.4722L42.2637 13.7976L17.2437 94.4376ZM106.093 2.78296L106.108 2.77378L106.123 2.76388C106.724 2.36339 107.36 2.16985 108.047 2.16985C108.604 2.16985 109.192 2.4381 109.818 3.16794C110.501 3.96552 111.133 4.88313 111.712 5.92408L111.721 5.94097L111.731 5.95735C112.322 6.90317 112.715 7.63938 112.931 8.17838L112.943 8.20953L112.958 8.23945L147.878 76.9995L148.545 78.3128L149.215 77.0008L184.304 8.2634C184.672 7.64716 185.095 6.86094 185.571 5.90989C186.142 4.88441 186.764 3.97888 187.438 3.19011C188.214 2.41971 188.806 2.16985 189.227 2.16985C190.06 2.16985 190.662 2.37619 191.099 2.7255L191.138 2.75701L191.181 2.78296C191.429 2.93165 191.717 3.35163 191.717 4.47984V129.76C191.717 130.652 191.431 131.264 190.913 131.699C190.459 132.059 189.911 132.25 189.227 132.25C188.564 132.25 187.949 132.07 187.368 131.698C186.974 131.275 186.737 130.661 186.737 129.76V17.2598L185.322 16.9142L151.301 82.4342L151.296 82.4444C150.714 83.6091 150.157 84.4297 149.637 84.9495C149.277 85.309 148.922 85.4499 148.547 85.4499C148.318 85.4499 147.952 85.3324 147.428 84.9202C146.917 84.399 146.37 83.5874 145.798 82.4444L145.794 82.4357L111.954 16.9157L110.537 17.2598V129.76C110.537 130.652 110.251 131.264 109.733 131.699C109.279 132.059 108.731 132.25 108.047 132.25C107.384 132.25 106.769 132.07 106.188 131.698C105.794 131.275 105.557 130.661 105.557 129.76V4.47984C105.557 3.35163 105.845 2.93165 106.093 2.78296ZM212.816 129.375L212.843 129.32L212.861 129.262L251.921 3.08163L251.927 3.06184L251.932 3.04174C252.144 2.19391 252.481 1.74453 252.851 1.52297C253.331 1.235 253.857 1.08984 254.445 1.08984C254.983 1.08984 255.48 1.26421 255.956 1.6455L256.018 1.69513L256.089 1.73066C256.604 1.98805 256.956 2.40876 257.144 3.06588L257.146 3.07284L257.148 3.07976L295.848 129.26L295.866 129.319L295.894 129.375C295.947 129.482 295.995 129.658 295.995 129.94C295.995 130.221 295.892 130.547 295.605 130.93C295.317 131.314 294.922 131.667 294.405 131.981C294.046 132.155 293.631 132.25 293.145 132.25C292.712 132.25 292.256 132.125 291.767 131.838C291.475 131.607 291.194 131.182 290.986 130.454L290.984 130.445L290.981 130.437L281.801 100.917L281.637 100.39H281.085H227.445H226.889L226.727 100.921L217.727 130.441L217.727 130.441L217.724 130.454C217.522 131.158 217.198 131.577 216.799 131.817C216.319 132.105 215.793 132.25 215.205 132.25C214.854 132.25 214.42 132.163 213.893 131.955C213.533 131.772 213.218 131.552 212.945 131.296C212.795 130.957 212.715 130.569 212.715 130.12C212.715 129.678 212.774 129.459 212.816 129.375ZM228.709 94.4376L228.407 95.4099H229.425H279.105H280.118L279.822 94.4405L255.162 13.8005L254.45 11.4722L253.729 13.7976L228.709 94.4376Z"
              stroke="white"
              strokeWidth="1.5"
            />
          </m.svg>
        </div>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.72, duration: 0.7 } }}
          exit={exitOptions}
          className="login-box-right"
        >
          <p className="login-form-title">user login</p>
          <p className="login-form-text">Welcome</p>
          <hr className="login-form-dash" />
          <Oval
            height={40}
            width={40}
            color="#1a8ee1"
            wrapperStyle={{ right: "10%", top: "9.2%" }}
            wrapperClass="loader"
            visible={loader}
            ariaLabel="oval-loading"
            secondaryColor="#8dc7f0"
            strokeWidth={2}
            strokeWidthSecondary={3}
          />
          {renderForm}
        </m.div>
      </m.div>
    </div>
  );
}
