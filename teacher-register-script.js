import { db } from "./firebase.js";
import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


document.getElementById("teacherRegisterBtn").addEventListener("click", async function () {

    const department =
        document.getElementById("teacherDepartment").value;

    const name =
        document.getElementById("teacherName").value.trim();

    const password =
        document.getElementById("teacherPassword").value;

    const confirmPassword =
        document.getElementById("confirmTeacherPassword").value;


    if (department === "") {
        alert("Please select your department");
        return;
    }

    if (name === "") {
        alert("Please enter your name");
        return;
    }

    if (password === "") {
        alert("Please set your password");
        return;
    }

    if (confirmPassword === "") {
        alert("Please re-enter your password");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }


    try {

        await addDoc(collection(db, "teachers"), {
            department: department,
            name: name,
            password: password,
            collegeCode: localStorage.getItem("loggedInCollegeCode")
        });

        alert("Teacher Registered Successfully");

        window.location.href = "index2.html";

    } catch (error) {

        console.error(error);
        alert("Registration Failed");

    }

});

// Show Password
document.getElementById("showTeacherPassword").addEventListener("change", function () {

    const password = document.getElementById("teacherPassword");
    const confirmPassword = document.getElementById("confirmTeacherPassword");

    if (this.checked) {
        password.type = "text";
        confirmPassword.type = "text";
    } else {
        password.type = "password";
        confirmPassword.type = "password";
    }

});