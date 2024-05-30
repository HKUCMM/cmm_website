import React from "react";

function Home() {
  // Sample API fetch
  // const [backendData, setBackendData] = useState([{}]);

  // useEffect(() => {
  //     fetch("api/sample/user").then(
  //         response => response.json()
  //     ).then(
  //         data => {
  //             setBackendData(data)
  //         }
  //     )
  // }, []);

  return (
    <>
      <h1>Home Page</h1>
      {/* <div>
                {(typeof backendData.users === "undefined") ? (
                    <p>Loading ...</p>
                ) : (
                    backendData.users.map((user, i) => (
                        <p key={i}>{user}</p>
                    ))
                )}
            </div> */}
    </>
  );
}

export default Home;
