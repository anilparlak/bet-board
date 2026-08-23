import "./styles/global.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Spinner from "shared/components/Spinner/Spinner";
import { initWebVitals } from "reportWebVitals";

initWebVitals();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
