import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import "../styles/codespace.scss"

export default function Codespace() {
    const location = useLocation();
    const { level_id, diff, userName, owner, repo} = location.state;

    const [embedURL, setEmbedURL] = useState(null);
    const [cs_id, setCs_id] = useState(null);

    useEffect(() => {
      const generateCodespace = async () => {
        try {
          const response = await fetch(`http://localhost:8080/levels/create-codespace?level=${level_id}`, {
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json(); // Await the JSON parsing
          console.log("URL from the response:", data);
          setEmbedURL(data.web_url)
          setCs_id(data.id)
          window.open(data.web_url, '_blank', 'noreferrer')
  
          // Now you can work with the 'data' object
        } catch (error) {
          // Handle errors here
          console.error("Fetch error:", error);
        }
      };
      generateCodespace();
    }, []);

    const handleDelete = async () => {
      try {
        const response = await fetch(`http://localhost:8080/levels/delete?id=${cs_id}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json(); // Await the JSON parsing
        // Now you can work with the 'data' object
      } catch (error) {
        // Handle errors here
        console.error("Fetch error:", error);
      }
    }
  return (
    <div>
        <div className='topbar'>
            <h1>{diff}: {level_id}</h1>
            <Link to={`/levels/login-success?username=${userName}`} className='login-button links back-bt'>Back</Link>
        </div>
        <div className='codespace-view'>
          {/* ( embedURL?
            {/* <iframe src={embedURL} className='embed'></iframe>
             */}
             <button onClick={handleDelete} style={{'width': '5rem'}}>Delete Codespace</button>
        </div>

    </div>
  )
}
