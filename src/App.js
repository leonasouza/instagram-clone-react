import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const addPostsQuantity = 1;
  const initialPostsQuantity = 5;
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState("");
  const [openUpload, setOpenUpload] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(initialPostsQuantity);
  const headerImg = "https://i.imgur.com/CeA5Wsk.png";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  //1:15:00
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  const handleUpload = () => {
    setOpenUpload(false);
  };

  const showMorePosts = () => {
    setPage((previousValue) => previousValue + addPostsQuantity);
  };

  const handleScroll = (e) => {
    window.onscroll = function (ev) {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        showMorePosts();
      }
    };
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src={headerImg} />
            </center>
            <Input
              placeholder="usuário"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Cadastrar
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src={headerImg} />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Login
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__upload">
            <center>
              <img className="app__headerImage" src={headerImg} />
            </center>
            {user && (
              <ImageUpload
                onUpload={handleUpload}
                username={user.displayName}
              />
            )}
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img className="app__headerImage" src={headerImg} />
        {user ? (
          <div className="app__loginContainer">
            <div className="app__username">
              Olá, <strong>{user.displayName}</strong>!
            </div>
            <Button
              onClick={() => {
                setOpenUpload(true);
              }}
            >
              Upload
            </Button>
            <Button
              onClick={() => {
                auth.signOut();
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button
              onClick={() => {
                setOpenSignIn(true);
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              Cadastrar
            </Button>
          </div>
        )}
      </div>

      <div className="app__post">
        {posts.slice(0, page).map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            imageUrl={post.imageUrl}
            caption={post.caption}
          />
        ))}
        {handleScroll()}
        {/*<button onClick={showMorePosts}>Carregar mais posts</button>*/}
      </div>
    </div>
  );
}

export default App;
