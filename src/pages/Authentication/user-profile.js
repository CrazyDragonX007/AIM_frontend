import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form
} from "reactstrap"

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import withRouter from "components/Common/withRouter";

// actions
import { editProfile, resetProfileFlag, setBreadcrumbItems } from "../../store/actions"

const UserProfile = () => {

  //meta title
  document.title = "Profile | AIM - All in One Manager";

  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);

  const selectProfileState = (state) => state.Profile;
    const ProfileProperties = createSelector(
      selectProfileState,
        (profile) => ({
          error: profile.error,
          success: profile.success,
        })
    );

    const {
      error,
      success
  } = useSelector(ProfileProperties);

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("user")) || {};
      if (process.env.REACT_APP_DEFAULTAUTH === "jwt" && obj){
        setname(obj.name);
        setemail(obj.email);
        setidx(obj._id);
      }
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, success]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: name || '',
      idx: idx || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your Name"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    }
  });

  const getImageSrc = () => {
    const url = "https://ui-avatars.com/api/?background=random"
    return `${url}&name=${name}`
  }

  const breadcrumbItems = useSelector((state) => state.Breadcrumb.breadcrumbItems);
  useEffect(() => {
    breadcrumbItems.push({ title: "Profile", link: "/profile" });
    dispatch(setBreadcrumbItems('Profile',breadcrumbItems));
    }, [dispatch,breadcrumbItems])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={getImageSrc()}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">{email}</p>
                        <p className="mb-0">Id no: #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Change Name</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Label className="form-label">Name</Label>
                  <Input
                    name="name"
                    // value={name}
                    className="form-control"
                    placeholder="Enter your Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={
                      validation.touched.username && validation.errors.username ? true : false
                    }
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update Name
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
