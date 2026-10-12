import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
async function registerCollege() {

    const name = document.getElementById("collegeName").value.trim();
    const code = document.getElementById("collegeCode").value.trim();
    const year = document.getElementById("academicYear").value.trim();
    const address = document.getElementById("collegeAddress").value.trim();

    if (name === "") {
        alert("Please enter your college name");
        return;
    }

    if (code === "") {
        alert("Please enter your college code");
        return;
    }

    if (year === "") {
        alert("Please enter your academic year");
        return;
    }

    if (address === "") {
        alert("Please enter your college address");
        return;
    }

    try {
       const collegeRef = await addDoc(collection(db, "colleges"), {
    name: name,
    code: code,
    year: year,
    address: address
});

// Registered college-ஐ current college-ஆக save செய்கிறோம்
localStorage.setItem("loggedInCollegeCode", code);
localStorage.setItem("loggedInCollegeName", name);
localStorage.setItem("loggedInCollegeYear", year);

alert("College Registered Successfully");
window.location.href = "welcome.html";

    } catch (error) {
        console.error(error);
        alert("Registration Failed");
    }
}
window.registerCollege = registerCollege;
