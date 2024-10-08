import { useEffect, useRef, useState } from "react";
import StartScreen from "../../Components/StartScreen"
import logo from '/icons/icon-1024x1024.png'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

import { useLoginMutation } from "../../features/auth/authApiSlice";



const Login = () => {

    const userRef = useRef();
    const msgRef = useRef();
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch(); 
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
      userRef.current.focus();
    }, []);
  
    useEffect(() => {
      if (successMsg) {
        const timeoutId = setTimeout(() => {
          setSuccessMsg("");
        }, 20000);
  
        return () => {
          clearTimeout(timeoutId);
        };
      }
    }, [successMsg]);
  
    useEffect(() => {
      setErrMsg("");
    }, [user, pwd]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const requestData = {
          username: user,
          password: pwd,
        };
        const userData = await login(requestData).unwrap();
        dispatch(setCredentials({ ...userData }));
        // console.log(userData);
        setSuccessMsg("Successful, redirecting...");
        setUser("");
        setPwd("");
        navigate("overview")
      } catch (err) {
        if (err?.status === 401) {
          console.log(err.data);
          setErrMsg(err?.data?.detail);
          if (err?.status === "FETCH_ERROR") {
            setErrMsg("Server not responding");
          } else if (err?.originalStatus === 400) {
            setErrMsg("Incorrect Username or Password");
          } 
           else if (err?.originalStatus === 404) {
            setErrMsg("Login Failed");
          }
        } else {
          setErrMsg("Login Failed");
        }
        msgRef.current.focus();
      }
    
    };
  
    const handleUserInput = (e) => setUser(e.target.value);
  
    const handlePwdInput = (e) => setPwd(e.target.value);  



  return (
    <>
        <StartScreen/>
        <div className="container-scroller">
          <div className="container-fluid page-body-wrapper full-page-wrapper">
            <div className="content-wrapper d-flex align-items-center justify-content-center auth">
              <div className="row w-100">
                <div className="col-lg-4 mx-auto">
                  <div className="auth-form-light text-center p-5">
                    <div className="brand-logo" style={{marginBottom: '-10px'}}>
                      <img src={logo} alt="Logo" className="mx-auto d-block" />
                    </div>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <h4>Welcome</h4>
                    <h6 className="font-weight-light">Log in to continue.</h6>
                    {/* ------------------------------------------------ */}
                    <div className="pt-2 pb-2">
                      <p
                        ref={msgRef}
                        className={
                          errMsg
                            ? "errmsg"
                            : successMsg
                            ? "successmsg"
                            : "offscreen"
                        }
                        aria-live="assertive"
                      >
                        {errMsg ? errMsg : successMsg ? successMsg : ""}
                      </p>
                    </div>
                    {/* ------------------------------------------------------ */}
                    <form
                      className="pt-2 needs-validation"
                      onSubmit={handleSubmit}
                    >
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-4"
                          id="exampleInputEmail1"
                          placeholder="Username"
                          ref={userRef}
                          value={user}
                          onChange={handleUserInput}
                          required
                          autoComplete="off"
                          
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control form-control-lg rounded-4"
                          id="exampleInputPassword1"
                          placeholder="Password"
                          onChange={handlePwdInput}
                          value={pwd}
                          required
                        />
                      </div>
                      <div className="mt-3">
                        <button className="btn btn-block btn-color btn-lg font-weight-medium auth-form-btn">
                          {isLoading ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            "LOG IN"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Login