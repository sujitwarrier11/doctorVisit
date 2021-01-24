import React from "react";
import httpRequest from "@root/Utilities/httpRequest";
import { useSelector } from "react-redux";
import Env from "@root/Env";

const withAuth = (Comp) => {
  console.log("env",Env)
  return (props) => {
    const { token } = useSelector((state) => state.user);

    const arrEclusions = [
      { url: "/api/Account/login", type: "all" },
      { url: "/api/register", type: "all" },
    ];

    const GetHeaders = (Headers, url) => {
      let objHeaders = {};
      if (
        arrEclusions.filter(
          (item) =>
            item.url === url.replace(Env.baseUrl, "") && item.type === "all"
        ).length === 0
      ) {
        objHeaders = {
          Authorization: `Bearer ${token}`,
          ...Headers,
        };
      }
      return objHeaders;
    };

    httpRequest.interceptors.request.use(
      (config) => {
        if (config.method === "post") {
          return {
            ...config,
            headers: GetHeaders(config.headers, config.url),
          };
        }
        return config;
      },
      (error) => {
        // commented due to empty bracket, either put something meaningful or remove this code
        // if (DEBUG) {}
        return Promise.reject(error);
      }
    );

    return <Comp {...props} isAuthorised={!!token} />;
  };
};

export default withAuth;
