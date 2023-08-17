import React from "react";
import { loginStyle } from "./style";
import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import { Formik } from "formik";
import ValidationErrorMessage from "../../components/ValidationErrorMessage";

import * as Yup from "yup";
import authService from "../../service/auth.service";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth";
import "../../assets/css/style.css";

export const Login = () => {
  const authContext = useAuthContext();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be more than 5 charector")
      .required("Password is required."),
  });

  const classes = loginStyle();

  const onSubmit = (data) => {
    authService.login(data).then((res) => {
      toast.success("Login successfully");
      authContext.setUser(res);
    });
  };

  return (
    <div className={classes.loginWrapper}>
      <div className="login-page-wrapper">
        <div className="container">
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            className="breadcrumb-wrapper"
          >
            <Link color="inherit" href="/" title="Home">
              Home
            </Link>
            <Typography color="textPrimary">Login</Typography>
          </Breadcrumbs>
          <Typography variant="h1">Login or Create an Account</Typography>
          <div className="">
            <div className="form-block">
              <Typography variant="h2">Registered Customers</Typography>
              <p>If you have an account with us, please log in.</p>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="form-row-wrapper">
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                        <ValidationErrorMessage
                          message={errors.email}
                          touched={touched.email}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                          onBlur={handleBlur}
                          onChange={handleChange}
                          id="password"
                          type="password"
                          name="password"
                        />
                        <ValidationErrorMessage
                          message={errors.password}
                          touched={touched.password}
                        />
                      </div>

                      <button
                        type="submit"
                        className="search-button login-btn btn"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
