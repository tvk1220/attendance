import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.getElementById("registerBtn").onclick = function () {
    window.location.href = "register.html";
};

document.getElementById("loginBtn").onclick = async function () {

    const collegeName = document.getElementById("collegeName").value.trim();
    const collegeCode = document.getElementById("collegeCode").value.trim();
    const academicYear = document.getElementById("academicYear").value.trim();

    if (collegeName === "") {
        alert("Please enter your college name");
        return;
    }

    if (collegeCode === "") {
        alert("Please enter your college code");
        return;
    }

    if (academicYear === "") {
        alert("Please enter your academic year");
        return;
    }

    const snapshot = await getDocs(collection(db, "colleges"));

    let found = false;

    snapshot.forEach((doc) => {
        const data = doc.data();

        if (
            data.name === collegeName &&
            data.code === collegeCode &&
            data.year === academicYear
        ) {
            found = true;
        }
    });

    if (found) {
    localStorage.setItem("loggedInCollegeCode", collegeCode);
    window.location.href = "index.html";
}
    else {
        alert("Please enter correct college details");
    }
};