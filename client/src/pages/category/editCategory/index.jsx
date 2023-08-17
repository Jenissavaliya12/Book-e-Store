import React from "react";
import { editStyle } from "./style";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import shared from "../../../utils/shared";
import * as Yup from "yup";
import { toast } from "react-toastify";
import categoryService from "../../../service/category.service";
import ValidationErrorMessage from "./../../../components/ValidationErrorMessage/index";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Formik } from "formik";

const EditCategory = () => {
  const classes = editStyle();

  const navigate = useNavigate();
  const initialValues = {
    name: "",
  };

  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category Name is required"),
  });
  useEffect(() => {
    if (id) getCategoryById();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const getCategoryById = () => {
    categoryService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
      });
    });
  };

  const onSubmit = (values) => {
    categoryService
      .save(values)
      .then((res) => {
        toast.success(
          values.id
            ? shared.messages.UPDATED_SUCCESS
            : "category created successfully"
        );
        navigate("/category");
      })
      .catch((e) => toast.error(shared.messages.UPDATED_FAIL));
  };

  return (
    <div className={classes.editWrapper}>
      <div className="container">
        <h1>{id ? "Edit" : "Add"} Category</h1>
        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          enableReinitialize={true}
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
                <div className="form-col">
                  <TextField
                    id="first-name"
                    name="name"
                    label="Category Name *"
                    variant="outlined"
                    inputProps={{ className: "small" }}
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <ValidationErrorMessage
                    message={errors.name}
                    touched={touched.name}
                  />
                </div>
              </div>
              <div className="btn-wrapper">
                <Button
                  className="green-btn btn"
                  variant="contained"
                  type="submit"
                  color="primary"
                  disableElevation
                >
                  Save
                </Button>
                <Button
                  className="pink-btn btn"
                  variant="contained"
                  type="button"
                  color="primary"
                  disableElevation
                  onClick={() => {
                    navigate("/category");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditCategory;
