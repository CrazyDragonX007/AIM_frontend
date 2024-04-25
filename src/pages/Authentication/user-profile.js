import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  // FormFeedback,
  // Form
} from "reactstrap"

// Formik Validation
// import * as Yup from "yup";
// import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";
import withRouter from "components/Common/withRouter";

// actions
import { changePassword, resetProfileFlag, setBreadcrumbItems } from "../../store/actions"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {

  //meta title
  document.title = "Profile | AIM - All in One Manager";

  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [id, setid] = useState('');

  const user = useSelector(state => state.Login?.user)
  const [newPassword, setnewPassword] = useState("");
  const {success,error} = useSelector(state => state.Profile);
  const [successMessage, setSuccessMessage] = useState(success);
  const [errorMessage, setErrorMessage] = useState(error);

  useEffect(() => {
    if(success?.length>0){
      toast.success(success);
      setSuccessMessage('');
    }
    if(error?.length>0){
      toast.error(error);
      setErrorMessage('');
    }
  }, [success,error,successMessage,errorMessage]);

  useEffect(() => {
      if (process.env.REACT_APP_DEFAULTAUTH === "jwt"){
        setname(user.name);
        setemail(user.email);
        setid(user._id);
      }
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }, [dispatch,user]);

  // const validation = useFormik({
  //   // enableReinitialize : use this flag when initial values needs to be changed
  //   enableReinitialize: true,
  //
  //   initialValues: {
  //     name: name || '',
  //     id: id || '',
  //   },
  //   validationSchema: Yup.object({
  //     name: Yup.string().required("Please Enter Your Name"),
  //   }),
  //   onSubmit: (values) => {
  //     dispatch(editProfile(values));
  //   }
  // });

  const updatePassword = () => {
    dispatch(changePassword({password:newPassword,id:id}));
  }

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
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-5">
                      <img
                        src={getImageSrc()}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center me-5" style={{marginLeft:20}}>
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">{email}</p>
                        <p className="mb-0">Id no: #{id}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <h4 className="card-title mb-4">Change Password</h4>
          <Card>
            <CardBody>
              <Label className="form-label">New Password</Label>
              <Input name="password" type="password" className="form-control" placeholder="Enter your password" value={newPassword} onChange={(e) => setnewPassword(e.target.value)} />
              <Button type="submit" onClick={updatePassword} color="danger" className="mt-3">Update Password</Button>
            </CardBody>
          </Card>
          {/*<h4 className="card-title mb-4">Change Name</h4>*/}
          {/*<Card>*/}
          {/*  <CardBody>*/}
          {/*    <Form*/}
          {/*      className="form-horizontal"*/}
          {/*      onSubmit={(e) => {*/}
          {/*        e.preventDefault();*/}
          {/*        validation.handleSubmit();*/}
          {/*        return false;*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <div className="form-group">*/}
          {/*        <Label className="form-label">Name</Label>*/}
          {/*        <Input*/}
          {/*          name="name"*/}
          {/*          className="form-control"*/}
          {/*          placeholder="Enter your Name"*/}
          {/*          type="text"*/}
          {/*          onChange={validation.handleChange}*/}
          {/*          onBlur={validation.handleBlur}*/}
          {/*          value={validation.values.name || ""}*/}
          {/*          invalid={*/}
          {/*            !!(validation.touched.name && validation.errors.name)*/}
          {/*          }*/}
          {/*        />*/}
          {/*        {validation.touched.name && validation.errors.name ? (*/}
          {/*          <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>*/}
          {/*        ) : null}*/}
          {/*        <Input name="idx" value={id} type="hidden" />*/}
          {/*      </div>*/}
          {/*      <div className="text-center mt-4">*/}
          {/*        <Button type="submit" color="danger">*/}
          {/*          Update Name*/}
          {/*        </Button>*/}
          {/*      </div>*/}
          {/*    </Form>*/}
          {/*  </CardBody>*/}
          {/*</Card>*/}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
