import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs,deleteDoc,onSnapshot  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHsBv_zF1Ug1CWV8WjIAs6wrh9hgPiWm4",
    authDomain: "hakathon-248b4.firebaseapp.com",
    projectId: "hakathon-248b4",
    storageBucket: "hakathon-248b4.appspot.com",
    messagingSenderId: "673769722351",
    appId: "1:673769722351:web:1358bf2159cb908c76261a",
    measurementId: "G-2PHQZL4BBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
console.log(app);



const loader = document.getElementById("loader")
const authenticationContainer = document.getElementById("authenticationContainer")
const signin = document.getElementById("signin")
const signinForm = document.getElementById("signinForm")
const password = document.getElementById("password")
const resetPassword = document.getElementById("resetPassword")
const LoginForm = document.getElementById("LoginForm")
const login = document.getElementById("login")
const loginButton = document.getElementById("loginButton")
const home = document.getElementById("home")
const gotoLogin = document.getElementById("gotoLogin")
const gotoLogout = document.getElementById("gotoLogout")
const dontHaveAccount = document.getElementById("dontHaveAccount")
const signUpImg = document.getElementById("signUp-img")
const dashBoard = document.getElementById("dashBoard")
const profile = document.getElementById("profile")
const userName = document.getElementById("userName")
const publishBlog = document.getElementById("publishBlog")
const publishTitle = document.getElementById("publishTitle")
const Publishdesc = document.getElementById("Publishdesc")
let getBlogs = document.getElementById("getBlogs")
let watchAllBlogs =document.getElementById("watchAllBlogs")
let firstName;
let card;   
let userImgUrl


signinForm.addEventListener("submit", regester)
loginButton.addEventListener("click", loginUser)
gotoLogin.addEventListener("click", moveToLogin)
dontHaveAccount.addEventListener("click", ceateAccount)
gotoLogout.addEventListener("click", logout)
publishBlog.addEventListener("click", setBlog)
signUpImg.addEventListener('change', uploadImg)
onAuthStateChanged(auth, (user) => {
    if (user) {
        loader.classList.add("d-none")
        dashBoard.classList.add("d-block")
        dashBoard.classList.remove("d-none")
        signin.classList.remove("d-block")
        signin.classList.add("d-none")
        const uid = user.uid;
        getUser()
        getBlog()
    } else {
        getAllBlogs()
        loader.classList.add("d-none")
        home.classList.remove('d-none')
        home.classList.add("d-block")
        dashBoard.classList.remove("d-block")
        dashBoard.classList.add("d-none")
    }
})





async function regester(e) {

    e.preventDefault()
    console.log(password.value);
    console.log(resetPassword.value);
    if (password.value == resetPassword.value) {
        const fistName = document.getElementById("FirstName").value
        const LastName = document.getElementById("LastName").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        createUserWithEmailAndPassword(auth, email, password)
            .then(async(userCredential) => {
                const user = userCredential.user
                let obj = {
                    fistName,
                    LastName,
                    email,
                    password,
                    userImg: await userImgUrl,
                }
                console.log("signin");
                // const refrence=
                setDoc(doc(db, "Users", user.uid), obj);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }
    else { alert("Reset password must be correct") }
}

function loginUser(e) {
    e.preventDefault()

    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            login.classList.add("d-none")
            login.classList.remove("d-block")
            // ...
            // dashBoard.classList.add("d-block")
            // dashBoard.classList.remove("d-none")
            // home.classList.remove("d-block")
            // home.classList.add("d-none")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            alert("email or password incorrect")
        });

}
function moveToLogin() {
    home.classList.add("d-none")
    login.classList.remove("d-none")
    login.classList.add("d-block")
}

function ceateAccount() {
    signin.classList.remove("d-none")
    login.classList.add("d-block")
    login.classList.add("d-none")

}





async function getUser() {
    let uid = auth.currentUser.uid
    const docRef = doc(db, "Users",uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        firstName = docSnap.data()
        console.log(firstName.fistName);
        userName.innerHTML = firstName.fistName
        console.log(firstName.fistName);
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

async function setBlog() {
    const publishDescInput = document.getElementById('Publishdesc');
    const publishTitleInput = document.getElementById('publishTitle');
    if(publishTitleInput.value.length>=5  && publishTitleInput.value.length<=50 && publishDescInput.value.length>=100&&publishDescInput.value.length<=3000)
    {

    const publishDesc = publishDescInput.value;
    const publishTitle = publishTitleInput.value;

    if (publishDesc && publishTitle) {
        const date = new Date().toLocaleDateString();
        console.log(publishDesc, publishTitle, date, auth.currentUser.uid);
        let name = firstName ; // Is this a typo? Should it be firstName.value or similar?
console.log(name);
        const obj = {
            author: name.fistName,
            uid: auth.currentUser.uid,
            title: publishTitle,
            blog: publishDesc,
            createdAt: date, 
            imgUrl: firstName.userImg
        };

        try {
            const docRef = await addDoc(collection(db, "blogs"), obj);
            console.log("Document written with ID: ", docRef.id);
        } catch (err) {
            console.error("Error adding document: ", err);
        }
    }}
    else{alert("please enter complete values")}
}


async function getBlog() {
    
    const q = query(collection(db, "blogs"), where("uid", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        getBlogs.innerHTML = '';

        querySnapshot.forEach((doc) => {
            console.log(doc.data().author);
            const card = `
            
            <div class="d-flex justify-content-center align-items-center    ">
        <div class="w-50 blog-card img-div">
            <img class="w-75" src="${doc.data().imgUrl}" alt="Blog Image">
        </div>
        <div>
        <div>
            <h3>${doc.data().title}</h3>
        </div>
        <div>
            <span class="me-4">${doc.data().author}</span>${doc.data().createdAt}
        </div>
        <div>${doc.data().blog}</div>
        <span class="mx-4 deleteBlog" data-id="${doc.id}" style=cursor: pointer; >delete</span>
       </div>
        `
        getBlogs.innerHTML += card;
        });

  

    const deleteBlogButtons = Array.from(document.getElementsByClassName("deleteBlog"));
    deleteBlogButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const blogId = button.getAttribute("data-id");
            try {
                await deleteDoc(doc(db, "blogs", blogId));
                console.log("Document deleted successfully!");

                // Remove only the deleted blog card from the UI
                const cardContainer = button.parentElement;
                cardContainer.remove();
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
        });
    });

    const editBlogButtons = Array.from(document.getElementsByClassName("editBlog"));
    editBlogButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const blogId = button.getAttribute("data-id");
            // Implement your edit logic here
            // You can use the blogId to identify the blog post for editing
          

            
            // You might want to open a modal or redirect to an edit page
            // where users can edit the blog post content
        });
    });
});

}
function getAllBlogs(){
    const q = query(collection(db, "blogs"),);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        watchAllBlogs.innerHTML=''
      querySnapshot.forEach((doc) => {
          let data = doc.data();
          const card = `
            
          <div class="d-flex my-1 p-2 container border rounded">
      <div class="blog-card img-div">
          <img class="w-75" src="${doc.data().imgUrl}" alt="Blog Image">
      </div>
      <div>
      <div>
          <h3>${doc.data().title}</h3>
      </div>
      <div>
          <span class="me-4">${doc.data().author}</span>${doc.data().createdAt}
      </div>
      <div>${doc.data().blog}</div>
    
     </div>
      `
      watchAllBlogs.innerHTML+=card
      });
      
    });
}

function uploadImg() {
    console.log(signUpImg.files[0]);
    console.log(signUpImg.files[0].name);
    const imgRef = ref(storage, `users/${signUpImg.files[0].name}`);
    uploadBytes(imgRef, signUpImg.files[0]).then((snapshot) => {
        getDownloadURL(imgRef)
            .then(url => {
                userImgUrl = url;
                console.log(userImgUrl);
            })
            .catch(err => console.error(err))
    });
};
function logout() {

    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}




















