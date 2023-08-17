import React from "react";
import { createAccountStyle } from "./style";
import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import ValidationErrorMessage from "../../components/ValidationErrorMessage/index";
import authService from "../../service/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { NavLink } from "react-router-dom";

const Register = () => {
  const classes = createAccountStyle();

  const navigate = useNavigate();
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    roleId: 0,
    password: "",
    confirmPassword: "",
  };
  const roleList = [
    { id: 2, name: "buyer" },
    { id: 3, name: "seller" },
  ];

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be 5 characters at minimum")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "Password and Confirm Password must be match."
      )
      .required("Confirm Password is required."),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    roleId: Yup.number().required("Role is required"),
  });

  const onSubmit = (data) => {
    delete data.confirmPassword;
    authService.create(data).then((res) => {
      navigate("/login");
      toast.success("Successfully registered");
    });
  };
  return (
    <div className={classes.createAccountWrapper}>
      <div className="create-account-page-wrapper">
        <div className="container">
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            className="breadcrumb-wrapper"
          >
            <Link color="inherit" href="/" title="Home">
              Home
            </Link>
            <Typography color="textPrimary">Create an Account</Typography>
          </Breadcrumbs>

          <Typography variant="h1">Login or Create an Account</Typography>
          <div className="create-account-row">
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
                  <div className="form-block">
                    <div className="personal-information">
                      <Typography variant="h2">Personal Information</Typography>
                      <p>
                        Please enter the following information to create your
                        account.
                      </p>

                      <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <ValidationErrorMessage
                          message={errors.firstName}
                          touched={touched.firstName}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          l
                        />
                        <ValidationErrorMessage
                          message={errors.lastName}
                          touched={touched.lastName}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <ValidationErrorMessage
                          message={errors.email}
                          touched={touched.email}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="select">Roles *</label>
                        <select
                          id={"roleId"}
                          name="roleId"
                          onChange={handleChange}
                          value={values.roleId}
                          required
                        >
                          {roleList.length > 0 &&
                            roleList.map((role) => (
                              <option value={role.name} key={"name" + role.id}>
                                {role.name}
                              </option>
                            ))}
                        </select>
                      </div>
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
                    <div className="form-group">
                      <label htmlFor="confirmPassword">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        id="confirm-password"
                        name="confirmPassword"
                      />
                      <ValidationErrorMessage
                        message={errors.confirmPassword}
                        touched={touched.confirmPassword}
                      />
                    </div>
                    <button type="submit" className="search-button btn">
                      Register
                    </button>
                  </div>
                </form>
              )}
            </Formik>
            <p className="botom-text">
              Already have an account?{" "}
              <NavLink className="navlink-text" to="/login">
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
