import React, { useEffect, useState } from 'react';

function Test() {
    const [postId, setPostId] = useState(0);

    const changePassword = () => {
        console.log("hello");
        fetch("/changepw", {
            method: "POST",
            body: JSON.stringify({
                newPassword: "0000",
                userId: 32,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log("error while changing password."));
    };

    const login = () => {
        fetch("/login", {
            method: "POST",
            body: JSON.stringify({
                loginEmail: "jhjang01@gmail.com",
                loginPassword: "0000",
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    const getSession = () => {
        fetch("/session")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch(err => console.log("error while getting session."));
    }

    const logout = () => {
        fetch("/logout").then((res) => {
            console.log(res);
        });
    }

    const getAllPosts = () => {
        fetch("/view-all-post").then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
        }).catch(err => console.log(err));
    }

    const getPost = () => {
        fetch("/view-post/" + postId).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
        }).catch(err => console.log(err));
    }

    return (
        <div>
            <h1>About Page</h1>
            <button onClick={changePassword}>Change Password</button>
            <button onClick={login}>Login</button>
            <button onClick={getSession}>Get Session</button>
            <button onClick={logout}>logout</button>
            <button onClick={getAllPosts}>Get all posts</button>
            <input type="number" onChange={(e) => { setPostId(e.target.value); console.log(e.target.value) }} />
            <button onClick={getPost}>Get Post {postId}</button>
        </div>
    )
}

export default Test;