import PropTypes from 'prop-types'
import React from "react"

import { Route, Routes } from "react-router-dom"
import { connect } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"

const App = props => {

  function getLayout() {
    let layoutCls = VerticalLayout
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout()
  return (
    <React.Fragment>
      <Routes>
      {/* Non-authenticated routes */}
      {authRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <NonAuthLayout>
              {route.component}
          </NonAuthLayout>
          }
        />
      ))}

      {/* Authenticated routes */}
      {userRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <Authmiddleware>
              <Layout>{route.component}</Layout>
              </Authmiddleware>              
          }
        />
      ))}
    </Routes>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
