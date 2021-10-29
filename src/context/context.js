import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);

  // errors

  const [error, setError] = useState({ show: false, msg: "" });

  const url = `${rootUrl}/rate_limit`;

  // check rate-limit
  // const checkRequests = async (url) => {
  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        console.log(data);

        setRequests(remaining);

        if (remaining === 0) {
          toggleError(true, "u hav exceeded the rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) => {
      console.log(err);
    });
    console.log(response);
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;

      // await Promise.allSettled([
      //   axios(`${rootUrl}/users/${login}/repos?per_page=100`),
      //   axios(`${followers_url}?per_page=100`),
      // ]).then((results) => {
      //   console.log(results);
      // });

      // repos
      axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
        setRepos(response.data)
      );

      // followers
      axios(`${followers_url}?per_page=100`).then((response) =>
        setFollowers(response.data)
      );
    } else {
      toggleError(true, "there is no user with that username");
    }
    checkRequests();
    setLoading(false);
  };

  useEffect(checkRequests, []);

  // useEffect(() => {
  //   checkRequests();
  //   console.log("loaded");
  // }, []);
  return (
    <AppContext.Provider
      value={{
        loading,
        searchGithubUser,
        githubUser,
        repos,
        followers,
        requests,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext };
