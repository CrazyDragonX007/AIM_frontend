import React, { useEffect } from 'react'
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-dark.png";

// action
import { registerUser, apiError } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import { Link, useNavigate } from "react-router-dom";
import { Alert, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from 'reactstrap';

const Register = () => {
  //meta title
  document.title = "Register | AIM - All in one Manager";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      name: '',
      password: '',
      role:'Admin'
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      name: Yup.string().required("Please Enter Your Name"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(registerUser(values,navigate));
    }
  });


  const selectAccountState = (state) => state.Account;
  const AccountProperties = createSelector(
    selectAccountState,
    (account) => ({
      user: account.user,
      registrationError: account.registrationError,
      success: account.success
      // loading: account.loading,
    })
  );

  const {
    user,
    registrationError, success
    // loading
  } = useSelector(AccountProperties);

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

useEffect(() => {
  success && setTimeout(() => navigate("/login"), 2000)
}, [success,navigate])

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <Card className="overflow-hidden">
                            <CardBody className="pt-0">
                                <h3 className="text-center mt-5 mb-4">
                                    <Link to="/" className="d-block auth-logo">
                                        <img src={logoDark} alt="" height="100" className="auth-logo-dark" />
                                        <img src={logoLight} alt="" height="100" className="auth-logo-light" />
                                    </Link>
                                </h3>
                                <div className="p-3">
                                    <h4 className="text-muted font-size-18 mb-1 text-center">Free Register</h4>
                                    <Form
                                      className="form-horizontal mt-4"
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit();
                                        return false;
                                      }}
                                    >
                                      {user && user ? (
                                        <Alert color="success">
                                          Register User Successfully
                                        </Alert>
                                      ) : null}

                                      {registrationError && registrationError ? (
                                        <Alert color="danger">{registrationError}</Alert>
                                      ) : null}

                                        <div className="mb-3">
                                            <Label htmlFor="useremail">Email</Label>
                                            <Input
                                              id="email"
                                              name="email"
                                              className="form-control"
                                              placeholder="Enter email"
                                              type="email"
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              value={validation.values.email || ""}
                                              invalid={
                                                validation.touched.email && validation.errors.email ? true : false
                                              }
                                            />
                                            {validation.touched.email && validation.errors.email ? (
                                              <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                            ) : null}
                                        </div>

                                        <div className="mb-3">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                              name="name"
                                              type="text"
                                              placeholder="Enter full name"
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              value={validation.values.name || ""}
                                              invalid={
                                                validation.touched.name && validation.errors.name ? true : false
                                              }
                                            />
                                            {validation.touched.name && validation.errors.name ? (
                                              <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                                            ) : null}
                                        </div>

                                        <div className="mb-3">
                                            <Label htmlFor="userpassword">Password</Label>
                                            <Input
                                              name="password"
                                              type="password"
                                              placeholder="Enter Password"
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              value={validation.values.password || ""}
                                              invalid={
                                                validation.touched.password && validation.errors.password ? true : false
                                              }
                                            />
                                            {validation.touched.password && validation.errors.password ? (
                                              <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                            ) : null}
                                        </div>

                                        <div className="mb-3 row mt-4">
                                            <div className="col-12 text-end">
                                                <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Register</button>
                                            </div>
                                        </div>

                                        {/*<div className="mb-0 row">*/}
                                        {/*    <div className="col-12 mt-4">*/}
                                        {/*        <p className="text-muted mb-0 font-size-14">By registering you agree to the Lexa <Link to="#" className="text-primary">Terms of Use</Link></p>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>
                        <div className="text-center">
                            <p>Already have an account ? <Link to="/login" className="text-primary"> Login </Link> </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
      
    </React.Fragment>
  )
}

export default Register
