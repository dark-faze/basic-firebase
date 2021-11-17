//User Auth

const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');

const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);  //Opens the popup for signin
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {      //user is an object made by firebase
    if(user) {
       whenSignedIn.hidden = false;   //Displays the element
       whenSignedOut.hidden = true;
       userDetails.innerHTML = `<h3>Hello ${user.displayName}!<h3>`;
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = `<h2>Signed Out</h2>`
    }
});

//Using Firestore

const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {    
    if (user) {       //if(user) is used to check if the user is logged in or not
    thingsRef = db.collection('things')
    createThing.onclick = () =>{
        const { serverTimestamp } = firebase.firestore.FieldValue;
        thingsRef.add({
            uid: user.uid,
            name: faker.commerce.productName(),
            createdAt: serverTimestamp()
        });
    }

unsubscribe = thingsRef
.where('uid', '==', user.uid)
.orderBy('createdAt') // Requires a query
.onSnapshot(querySnapshot => {
    
    // Map results to an array of li elements

    const items = querySnapshot.docs.map(doc => {

        return `<li>${doc.data().name}</li>`

    });

    thingsList.innerHTML = items.join('');

});


} else {
// Unsubscribe when the user signs out
unsubscribe && unsubscribe();
}
});


