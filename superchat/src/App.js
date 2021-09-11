import React, {useRef,useState} from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
    apiKey: "AIzaSyA5juyepGbrMQoyDPgsMQ15ezxoVdn1hBM",
    authDomain: "chatapp-react-firebase-16f8b.firebaseapp.com",
    projectId: "chatapp-react-firebase-16f8b",
    storageBucket: "chatapp-react-firebase-16f8b.appspot.com",
    messagingSenderId: "1014394207924",
    appId: "1:1014394207924:web:0d400bab21b2a1191a61e1",
    measurementId: "G-5D0STM5FZZ"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
//const analytics = firebase.analytics();

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);    
  }

  return (<button onClick={signInWithGoogle}> Sign in with Google</button>)
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.SignOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, {idField : 'id'}); 
  const [formValue, setFormValue] = useState('');

  const sendMessage =async(e) => {
    e.preventDefault();
    const {uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text : formValue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid, 
      photoURL 
    })
    setFormValue('');
    dummy.current.scrollIntoView({behavior:'smooth'});
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      <div ref ={dummy}></div>
      </main>
  <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} />
    <button type="submit">Send</button>
  </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
    )
}

export default App;
