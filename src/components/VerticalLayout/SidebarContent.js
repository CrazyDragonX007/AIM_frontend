import PropTypes from "prop-types"
import React, { useCallback, useEffect, useRef } from "react"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import withRouter from "components/Common/withRouter"
import { Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { getProjects } from "../../store/projects/actions"

const SidebarContent = props => {
  const dispatch = useDispatch()
  const projects = useSelector(state => state.Projects?.projects)
  console.log(projects)

  useEffect(() => {
    dispatch(getProjects())
  }, [dispatch])

  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = process.env.PUBLIC_URL + props.router.location.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [props.router.location.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Main")} </li>
            <li>
              <Link to="/dashboard" className="waves-effect">
                <i className="mdi mdi-view-dashboard"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
            {projects?.map((project,index) => {
              return (
                <li key={index}>
                  <Link to="/project-details" state={{project:project}} className="waves-effect">
                    <i className="mdi mdi-view-dashboard"></i>
                    <span>{props.t(project.title)}</span>
                  </Link>
                </li>
              )
            })}
            {user && user.role === 'Admin' && (
                <li>
            <Link to='/admin-settings' className='waves-effect position-fixed bottom-0 mb-lg-3'>
              <i className="mdi mdi-view-dashboard "></i>
              <span>Admin Settings</span>
            </Link>
                </li>
            )}
          </ul>

            {/*<li>*/}
            {/*  <Link to="/calendar" className=" waves-effect">*/}
            {/*    <i className="mdi mdi-calendar-check"></i>*/}
            {/*    <span>{props.t("Calendar")}</span>*/}
            {/*  </Link>*/}
            {/*</li>*/}

            {/*<li>*/}
            {/*  <Link to="/#" className="has-arrow waves-effect">*/}
            {/*    <i className="mdi mdi-email-outline"></i>*/}
            {/*    <span>{props.t("Email")}</span>*/}
            {/*  </Link>*/}
            {/*  <ul className="sub-menu" >*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Inbox")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Email Read")} </Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Email Compose")} </Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</li>*/}

            {/*<li>*/}
            {/*  <Link to="#" className=" waves-effect">*/}
            {/*    <i className="mdi mdi-chat-processing-outline"></i>*/}
            {/*    /!*<span className="badge rounded-pill bg-danger float-end">Hot</span>*!/*/}
            {/*    <span>Chat</span>*/}
            {/*  </Link>*/}
            {/*</li>*/}

            {/*<li>*/}
            {/*  <Link to="#" className=" waves-effect">*/}
            {/*    <i className="mdi mdi-billboard"></i>*/}
            {/*    /!*<span className="badge rounded-pill bg-success float-end">New</span>*!/*/}
            {/*    <span>Kanban Board</span>*/}
            {/*  </Link>*/}
            {/*</li>*/}

            {/*<li className="menu-title">{props.t("Components")}</li>*/}
            {/*<li>*/}
            {/*  <Link to="/#" className="has-arrow waves-effect">*/}
            {/*    <i className="mdi mdi-buffer"></i>*/}
            {/*    <span>{props.t("UI Elements")}</span>*/}
            {/*  </Link>*/}
            {/*  <ul className="sub-menu">*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Alerts")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Buttons")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Badge")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Cards")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Carousel")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Dropdowns")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">Utilities<span className="badge rounded-pill bg-success float-end">New</span></Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Grid")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Images")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Lightbox")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Modals")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">Colors<span className="badge rounded-pill bg-warning float-end">New</span></Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">Offcanvas<span className="badge rounded-pill bg-warning float-end">New</span></Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Pagination")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Popover & Tooltips")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Range Slider")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Session Timeout")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Progress Bars")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Tabs & Accordions")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Typography")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Video")}</Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</li>*/}

            {/*<li>*/}
            {/*  <Link to="/#" className="waves-effect">*/}
            {/*    <i className="mdi mdi-clipboard-outline"></i>*/}
            {/*    <span className="badge rounded-pill bg-success float-end">6</span>*/}
            {/*    <span>{props.t("Forms")}</span>*/}
            {/*  </Link>*/}
            {/*  <ul className="sub-menu">*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Form Elements")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Form Validation")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Form Advanced")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Form Editors")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Form File Upload")} </Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Form Xeditable")}</Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</li>*/}

            {/*<li>*/}
            {/*  <Link to="/#" className="has-arrow waves-effect">*/}
            {/*    <i className="mdi mdi-chart-line"></i>*/}
            {/*    <span>{props.t("Charts")}</span>*/}
            {/*  </Link>*/}

            {/*  <ul className="sub-menu">*/}
            {/*    <li>*/}
            {/*      <Link to="#">*/}
            {/*        {props.t("Apex charts")}*/}
            {/*      </Link>*/}
            {/*    </li>*/}

            {/*    <li>*/}
            {/*      <Link to="#" className="dropdown-item">*/}
            {/*        {props.t("Chartjs Chart")}*/}
            {/*      </Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#" className="dropdown-item">*/}
            {/*        {props.t("Sparkline Chart")}*/}
            {/*      </Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#" className="dropdown-item">*/}
            {/*        {props.t("C3 Chart")}*/}
            {/*      </Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#" className="dropdown-item">*/}
            {/*        {props.t("Jquery Knob Chart")}*/}
            {/*      </Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</li>*/}

            {/*<li>*/}
            {/*  <Link to="/#" className="has-arrow waves-effect">*/}
            {/*    <i className="mdi mdi-format-list-bulleted-type"></i>*/}
            {/*    <span>{props.t("Tables")}</span>*/}
            {/*  </Link>*/}
            {/*  <ul className="sub-menu">*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Basic Tables")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Data Tables")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">*/}
            {/*        {props.t("Responsive Table")}*/}
            {/*      </Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Editable Table")}</Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</li>*/}

            {/*<li>*/}
            {/*  <Link to="/#" className="has-arrow waves-effect">*/}
            {/*    <i className="mdi mdi-album"></i>*/}
            {/*    <span>{props.t("Icons")}</span>*/}
            {/*  </Link>*/}
            {/*  <ul className="sub-menu">*/}
            {/*    <li>*/}
            {/*      <Link to="#">*/}
            {/*        {props.t("Material Design")}*/}
            {/*      </Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Ion Icons")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Font Awesome")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Themify Icons")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Dripicons")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Typicons Icons")}</Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</li>*/}

            {/*<li>*/}
            {/*  <Link to="/#" className="waves-effect">*/}
            {/*    <span className="badge rounded-pill bg-danger float-end">2</span>*/}
            {/*    <i className="mdi mdi-google-maps"></i>*/}
            {/*    <span>{props.t("Maps")}</span>*/}
            {/*  </Link>*/}
            {/*  <ul className="sub-menu">*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Google Maps")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Vector Maps")}</Link>*/}
            {/*    </li>*/}

            {/*  </ul>*/}
            {/*</li>*/}

            {/*<li className="menu-title">Extras</li>*/}

            {/*<li>*/}
            {/*  <Link to="/#" className="has-arrow waves-effect">*/}
            {/*    <i className="mdi mdi-account-box"></i>*/}
            {/*    <span>{props.t("Authentication")}</span>*/}
            {/*  </Link>*/}
            {/*  <ul className="sub-menu">*/}
            {/*    <li>*/}
            {/*      <Link to="/pages-login">{props.t("Login")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="/pages-register">{props.t("Register")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="/page-recoverpw">*/}
            {/*        {props.t("Recover Password")}*/}
            {/*      </Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="/auth-lock-screen">{props.t("Lock Screen")}</Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</li>*/}

            {/*<li>*/}
            {/*  <Link to="/#" className="has-arrow waves-effect">*/}
            {/*    <i className="mdi mdi-text-box-multiple-outline"></i>*/}
            {/*    <span>{props.t("Extra Pages")}</span>*/}
            {/*  </Link>*/}
            {/*  <ul className="sub-menu">*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Timeline")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Invoice")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="#">{props.t("Directory")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="/pages-blank">{props.t("Blank Page")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="/pages-404">{props.t("Error 404")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="/pages-500">{props.t("Error 500")}</Link>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</li>*/}
            {/*<li>*/}
            {/*  <Link to="/#" className="has-arrow waves-effect">*/}
            {/*    <i className="mdi mdi-share-variant"></i>*/}
            {/*    <span>{props.t("Multi Level")}</span>*/}
            {/*  </Link>*/}
            {/*  <ul className="sub-menu">*/}
            {/*    <li>*/}
            {/*      <Link to="/#">{props.t("Level 1.1")}</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*      <Link to="/#" className="has-arrow">*/}
            {/*        {props.t("Level 1.2")}*/}
            {/*      </Link>*/}
            {/*      <ul className="sub-menu">*/}
            {/*        <li>*/}
            {/*          <Link to="/#">{props.t("Level 2.1")}</Link>*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*          <Link to="/#">{props.t("Level 2.2")}</Link>*/}
            {/*        </li>*/}
            {/*      </ul>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</li>*/}
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
