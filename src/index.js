import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { AppProvider } from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";

// dev-1ljnff-3.us.auth0.com
// Knauzv9VRIcALXXutFRyP4XHKEsmWyBd

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-1ljnff-3.us.auth0.com"
      clientId="Knauzv9VRIcALXXutFRyP4XHKEsmWyBd"
      redirectUri={window.location.origin}
    >
      <AppProvider>
        <App />
      </AppProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
