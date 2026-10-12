// ======================================================
// FIREBASE IMPORT
// ======================================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================================
// COMMON HELPERS
// ======================================================

// Get currently logged-in college code
function getCollegeCode() {

    const collegeCode =
        localStorage.getItem("loggedInCollegeCode") ||
        localStorage.getItem("loggedInTeacherCollegeCode") ||
        localStorage.getItem("loggedInStudentCollegeCode") ||
        "";

    return String(collegeCode).trim();
}


// ======================================================
// COLLEGE DETAILS
// ======================================================

async function loadCollegeDetails() {

    const collegeInfo =
        document.getElementById("collegeInfo");

    const collegeNameTitle =
        document.getElementById("collegeNameTitle");

    const collegeCodeTitle =
        document.getElementById("collegeCodeTitle");

    const collegeYearTitle =
        document.getElementById("collegeYearTitle");


    if (
        !collegeInfo ||
        !collegeNameTitle ||
        !collegeCodeTitle ||
        !collegeYearTitle
    ) {

        console.log(
            "College information elements not found on this page."
        );

        return;
    }


    const loggedInCollegeCode =
        getCollegeCode();


    console.log(
        "Logged in College Code:",
        loggedInCollegeCode
    );


    if (!loggedInCollegeCode) {

        collegeInfo.classList.add("hidden");

        return;
    }


    try {

        // ------------------------------------------
        // First search by exact code
        // ------------------------------------------

        const collegesRef =
            collection(db, "colleges");


        const q =
            query(
                collegesRef,
                where(
                    "code",
                    "==",
                    loggedInCollegeCode
                )
            );


        const snapshot =
            await getDocs(q);


        if (!snapshot.empty) {

            const college =
                snapshot.docs[0].data();

            showCollegeDetails(college);

            return;
        }


        // ------------------------------------------
        // Fallback search
        // Handles number/string mismatch
        // ------------------------------------------

        const allSnapshot =
            await getDocs(
                collection(
                    db,
                    "colleges"
                )
            );


        let foundCollege = null;


        allSnapshot.forEach(
            docSnap => {

                const college =
                    docSnap.data();


                const firebaseCode =
                    String(
                        college.code || ""
                    ).trim();


                if (
                    firebaseCode ===
                    loggedInCollegeCode
                ) {

                    foundCollege =
                        college;

                }

            }
        );


        if (foundCollege) {

            showCollegeDetails(
                foundCollege
            );

        } else {

            collegeInfo.classList.add(
                "hidden"
            );

            console.warn(
                "College not found:",
                loggedInCollegeCode
            );

        }


    } catch (error) {

        console.error(
            "College details loading error:",
            error
        );

        collegeInfo.classList.add(
            "hidden"
        );

    }

}


// ======================================================
// SHOW COLLEGE DETAILS
// ======================================================

function showCollegeDetails(college) {

    const collegeInfo =
        document.getElementById(
            "collegeInfo"
        );

    const collegeNameTitle =
        document.getElementById(
            "collegeNameTitle"
        );

    const collegeCodeTitle =
        document.getElementById(
            "collegeCodeTitle"
        );

    const collegeYearTitle =
        document.getElementById(
            "collegeYearTitle"
        );


    if (!collegeInfo) {
        return;
    }


    if (collegeNameTitle) {

        collegeNameTitle.textContent =
            college.name ||
            "College";

    }


    if (collegeCodeTitle) {

        collegeCodeTitle.textContent =
            "College Code : " +
            (college.code || "");

    }


    if (collegeYearTitle) {

        collegeYearTitle.textContent =
            "Academic Year : " +
            (college.year || "");

    }


    // IMPORTANT
    // Show college information

    collegeInfo.classList.remove(
        "hidden"
    );


    console.log(
        "College details displayed:",
        college
    );

}


// ======================================================
// STUDENT LOGIN
// ======================================================

const studentForm =
    document.getElementById(
        "studentForm"
    );


if (studentForm) {

    studentForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const regInput =
                document.getElementById(
                    "regNo"
                );

            const dobInput =
                document.getElementById(
                    "dob"
                );


            if (
                !regInput ||
                !dobInput
            ) {

                alert(
                    "Student login fields not found."
                );

                return;
            }


            const inputRegNo =
                regInput.value
                    .trim()
                    .toLowerCase();


            const inputDob =
                dobInput.value;


            const loggedInCollegeCode =
                getCollegeCode();


            if (!loggedInCollegeCode) {

                alert(
                    "College details not found. Please login with your college first."
                );

                return;
            }


            if (!inputRegNo) {

                alert(
                    "Please enter Register Number."
                );

                return;
            }


            if (!inputDob) {

                alert(
                    "Please select Date of Birth."
                );

                return;
            }


            try {

                // ------------------------------------------
                // Firebase Students
                // ------------------------------------------

                const studentSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "students"
                        )
                    );


                let student = null;


                studentSnapshot.forEach(
                    docSnap => {

                        const data =
                            docSnap.data();


                        const firebaseRegNo =
                            String(
                                data.regNo || ""
                            )
                                .trim()
                                .toLowerCase();


                        const firebaseDob =
                            String(
                                data.dob || ""
                            ).trim();


                        const firebaseCollege =
                            String(
                                data.collegeCode || ""
                            ).trim();


                        if (

                            firebaseRegNo ===
                            inputRegNo

                            &&

                            firebaseDob ===
                            inputDob

                            &&

                            firebaseCollege ===
                            loggedInCollegeCode

                        ) {

                            student =
                                data;

                        }

                    }
                );


                // ------------------------------------------
                // LocalStorage fallback
                // ------------------------------------------

                if (!student) {

                    let localStudents = [];


                    try {

                        localStudents =
                            JSON.parse(
                                localStorage.getItem(
                                    "attendance_students"
                                ) || "[]"
                            );

                        if (
                            !Array.isArray(
                                localStudents
                            )
                        ) {

                            localStudents = [];

                        }

                    } catch {

                        localStudents = [];

                    }


                    student =
                        localStudents.find(
                            s => {

                                const reg =
                                    String(
                                        s.regNo || ""
                                    )
                                        .trim()
                                        .toLowerCase();


                                const dob =
                                    String(
                                        s.dob || ""
                                    ).trim();


                                const college =
                                    String(
                                        s.collegeCode || ""
                                    ).trim();


                                return (

                                    reg ===
                                    inputRegNo

                                    &&

                                    dob ===
                                    inputDob

                                    &&

                                    college ===
                                    loggedInCollegeCode

                                );

                            }
                        );

                }


                // ------------------------------------------
                // LOGIN SUCCESS
                // ------------------------------------------

                if (student) {

                    alert(
                        `Welcome ${student.name || "Student"}! Login Successful.`
                    );


                    localStorage.setItem(
                        "userRole",
                        "student"
                    );


                    localStorage.setItem(
                        "loggedInStudentRegNo",
                        student.regNo || ""
                    );


                    localStorage.setItem(
                        "loggedInStudentCollegeCode",
                        loggedInCollegeCode
                    );


                    localStorage.setItem(
                        "loggedInStudentDepartment",
                        student.department || ""
                    );


                    localStorage.setItem(
                        "loggedInStudentYear",
                        student.year || ""
                    );


                    localStorage.setItem(
                        "loggedInStudentSemester",
                        student.semester || ""
                    );


                    window.location.href =
                        "teacher_dashboard.html";


                } else {

                    alert(
                        "Error: Register Number, Date of Birth or College details are incorrect!"
                    );

                }


            } catch (error) {

                console.error(
                    "Student login error:",
                    error
                );


                alert(
                    "Student login failed. Please try again."
                );

            }

        }
    );

}


// ======================================================
// TEACHER LOGIN
// ======================================================

const teacherForm =
    document.getElementById(
        "teacherForm"
    );


if (teacherForm) {

    teacherForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const deptElement =
                document.getElementById(
                    "deptSelect"
                );


            const passwordElement =
                document.getElementById(
                    "teacherPassword"
                );


            if (
                !deptElement ||
                !passwordElement
            ) {

                alert(
                    "Teacher login fields not found."
                );

                return;
            }


            const selectedDept =
                String(
                    deptElement.value || ""
                )
                    .trim()
                    .toUpperCase();


            const inputPassword =
                passwordElement.value;


            if (!selectedDept) {

                alert(
                    "Please select your department."
                );

                return;
            }


            if (!inputPassword) {

                alert(
                    "Please enter your password."
                );

                return;
            }


            const loggedInCollegeCode =
                getCollegeCode();


            if (!loggedInCollegeCode) {

                alert(
                    "College details not found. Please login with your college first."
                );

                return;
            }


            try {

                const snapshot =
                    await getDocs(
                        collection(
                            db,
                            "teachers"
                        )
                    );


                let loginSuccess =
                    false;


                let loggedTeacher =
                    null;


                snapshot.forEach(
                    docSnap => {

                        const teacher =
                            docSnap.data();


                        const teacherCollege =
                            String(
                                teacher.collegeCode || ""
                            ).trim();


                        const teacherDepartment =
                            String(
                                teacher.department || ""
                            )
                                .trim()
                                .toUpperCase();


                        const teacherPassword =
                            String(
                                teacher.password || ""
                            );


                        if (

                            teacherCollege ===
                            loggedInCollegeCode

                            &&

                            teacherDepartment ===
                            selectedDept

                            &&

                            teacherPassword ===
                            inputPassword

                        ) {

                            loginSuccess =
                                true;


                            loggedTeacher =
                                teacher;

                        }

                    }
                );


                if (loginSuccess) {

                    // ------------------------------------------
                    // Save teacher session
                    // ------------------------------------------

                    localStorage.setItem(
                        "loggedInCollegeCode",
                        loggedInCollegeCode
                    );


                    localStorage.setItem(
                        "loggedInTeacherCollegeCode",
                        loggedInCollegeCode
                    );


                    localStorage.setItem(
                        "loggedInTeacherName",
                        loggedTeacher.name || ""
                    );


                    localStorage.setItem(
                        "loggedInTeacherDepartment",
                        loggedTeacher.department || ""
                    );


                    localStorage.setItem(
                        "userRole",
                        "teacher"
                    );


                    alert(
                        "Teacher Login Successful!"
                    );


                    window.location.href =
                        "teacher_dashboard.html";


                } else {

                    alert(
                        "Invalid Department or Password for this College."
                    );

                }


            } catch (error) {

                console.error(
                    "Teacher login error:",
                    error
                );


                alert(
                    "Login failed. Please try again."
                );

            }

        }
    );

}


// ======================================================
// GET COLLEGE-SPECIFIC DEPARTMENT STORAGE KEY
// ======================================================

function getDepartmentStorageKey() {

    const collegeCode =
        getCollegeCode();


    if (!collegeCode) {

        return null;

    }


    return (
        "enabledStudentDepartments_" +
        collegeCode
    );

}


// ======================================================
// GET ENABLED DEPARTMENTS
// CURRENT COLLEGE ONLY
// ======================================================

function getEnabledStudentDepartments() {

    const storageKey =
        getDepartmentStorageKey();


    if (!storageKey) {

        return [];

    }


    try {

        const data =
            localStorage.getItem(
                storageKey
            );


        if (!data) {

            return [];

        }


        const departments =
            JSON.parse(data);


        if (!Array.isArray(departments)) {

            return [];

        }


        return departments.map(
            department =>
                String(
                    department
                )
                    .trim()
                    .toUpperCase()
        );


    } catch (error) {

        console.error(
            "Department localStorage error:",
            error
        );

        return [];

    }

}


// ======================================================
// UPDATE STUDENT REGISTER DEPARTMENT
// CURRENT COLLEGE ONLY
// ======================================================

function updateRegisterDepartment() {

    const departmentSelect =
        document.getElementById(
            "registerDepartment"
        );


    if (!departmentSelect) {

        return;

    }


    const collegeCode =
        getCollegeCode();


    if (!collegeCode) {

        departmentSelect.innerHTML = "";


        const option =
            document.createElement(
                "option"
            );


        option.value = "";


        option.textContent =
            "College Not Found";


        option.selected =
            true;


        departmentSelect.appendChild(
            option
        );


        return;

    }


    // ------------------------------------------
    // Get departments for CURRENT college
    // ------------------------------------------

    const enabledDepartments =
        getEnabledStudentDepartments();


    // ------------------------------------------
    // All departments
    // ------------------------------------------

    const departments = [

        "MCA",
        "MBA",
        "MSC",
        "BCA",
        "BBA",
        "CSE",
        "ECE",
        "EEE",
        "MECH",
        "CIVIL"

    ];


    // ------------------------------------------
    // Clear dropdown
    // ------------------------------------------

    departmentSelect.innerHTML = "";


    // ------------------------------------------
    // Default option
    // ------------------------------------------

    const defaultOption =
        document.createElement(
            "option"
        );


    defaultOption.value =
        "";


    defaultOption.textContent =
        enabledDepartments.length > 0
            ? "Select Enabled Department"
            : "No Department Enabled";


    defaultOption.selected =
        true;


    departmentSelect.appendChild(
        defaultOption
    );


    // ------------------------------------------
    // Add departments
    // ------------------------------------------

    departments.forEach(
        department => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                department;


            option.textContent =
                department;


            // Only current college enabled
            option.disabled =
                !enabledDepartments.includes(
                    department
                );


            departmentSelect.appendChild(
                option
            );

        }
    );


    departmentSelect.value =
        "";


    console.log(
        "Current College:",
        collegeCode
    );


    console.log(
        "Enabled Departments:",
        enabledDepartments
    );

}


// ======================================================
// OPEN STUDENT REGISTER POPUP
// ======================================================

function openStudentRegisterPopup() {

    const popup =
        document.getElementById(
            "studentRegisterPopup"
        );


    const departmentSelect =
        document.getElementById(
            "registerDepartment"
        );


    if (!popup) {

        console.error(
            "studentRegisterPopup not found"
        );

        return;

    }


    if (!departmentSelect) {

        console.error(
            "registerDepartment not found"
        );

        return;

    }


    const collegeCode =
        getCollegeCode();


    if (!collegeCode) {

        alert(
            "College details not found. Please login again."
        );

        return;

    }


    // Refresh current college departments
    updateRegisterDepartment();


    popup.classList.remove(
        "hidden"
    );


    popup.classList.add(
        "flex"
    );

}


// ======================================================
// CLOSE STUDENT REGISTER POPUP
// ======================================================

function closeStudentRegisterPopup() {

    const popup =
        document.getElementById(
            "studentRegisterPopup"
        );


    if (!popup) {

        return;

    }


    popup.classList.add(
        "hidden"
    );


    popup.classList.remove(
        "flex"
    );

}


// ======================================================
// STUDENT REGISTER FORM
// ======================================================

const studentRegisterForm =
    document.getElementById(
        "studentRegisterForm"
    );


if (studentRegisterForm) {

    studentRegisterForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            // ------------------------------------------
            // Get elements
            // ------------------------------------------

            const departmentElement =
                document.getElementById(
                    "registerDepartment"
                );


            const regNoElement =
                document.getElementById(
                    "registerRegNo"
                );


            const nameElement =
                document.getElementById(
                    "registerStudentName"
                );


            const phoneElement =
                document.getElementById(
                    "registerPhone"
                );


            const dobElement =
                document.getElementById(
                    "registerDob"
                );


            const yearElement =
                document.getElementById(
                    "registerYear"
                );


            const semesterElement =
                document.getElementById(
                    "registerSemester"
                );


            if (

                !departmentElement ||
                !regNoElement ||
                !nameElement ||
                !phoneElement ||
                !dobElement ||
                !yearElement ||
                !semesterElement

            ) {

                alert(
                    "Registration fields not found."
                );

                return;

            }


            // ------------------------------------------
            // Values
            // ------------------------------------------

            const department =
                departmentElement.value
                    .trim()
                    .toUpperCase();


            const regNo =
                regNoElement.value.trim();


            const name =
                nameElement.value.trim();


            const phone =
                phoneElement.value.trim();


            const dob =
                dobElement.value;


            const year =
                yearElement.value;


            const semester =
                semesterElement.value;


            // ------------------------------------------
            // Current College
            // ------------------------------------------

            const collegeCode =
                getCollegeCode();


            if (!collegeCode) {

                alert(
                    "College details not found. Please login again."
                );

                return;

            }


            // ------------------------------------------
            // Department enabled check
            // CURRENT COLLEGE ONLY
            // ------------------------------------------

            const enabledDepartments =
                getEnabledStudentDepartments();


            if (
                !enabledDepartments.includes(
                    department
                )
            ) {

                alert(
                    "This department is not enabled by your college teacher."
                );


                updateRegisterDepartment();

                return;

            }


            // ------------------------------------------
            // Validation
            // ------------------------------------------

            if (!regNo) {

                alert(
                    "Please enter Register Number."
                );

                return;

            }


            if (!name) {

                alert(
                    "Please enter Student Name."
                );

                return;

            }


            if (!phone) {

                alert(
                    "Please enter Parent Phone Number."
                );

                return;

            }


            if (
                !/^[0-9]{10}$/.test(
                    phone
                )
            ) {

                alert(
                    "Please enter a valid 10 digit phone number."
                );

                return;

            }


            if (!dob) {

                alert(
                    "Please select Date of Birth."
                );

                return;

            }


            if (!year) {

                alert(
                    "Please select Year."
                );

                return;

            }


            if (!semester) {

                alert(
                    "Please select Semester."
                );

                return;

            }


            // ------------------------------------------
            // Get Local Students
            // ------------------------------------------

            let currentStudents = [];


            try {

                currentStudents =
                    JSON.parse(
                        localStorage.getItem(
                            "attendance_students"
                        ) || "[]"
                    );


                if (
                    !Array.isArray(
                        currentStudents
                    )
                ) {

                    currentStudents = [];

                }

            } catch (error) {

                console.error(
                    "Local students error:",
                    error
                );

                currentStudents = [];

            }


            // ------------------------------------------
            // Duplicate check
            // College-wise
            // ------------------------------------------

            const alreadyExists =
                currentStudents.some(
                    student => {

                        const existingRegNo =
                            String(
                                student.regNo || ""
                            )
                                .trim()
                                .toLowerCase();


                        const existingCollege =
                            String(
                                student.collegeCode || ""
                            ).trim();


                        return (

                            existingRegNo ===
                            regNo
                                .trim()
                                .toLowerCase()

                            &&

                            existingCollege ===
                            collegeCode

                        );

                    }
                );


            if (alreadyExists) {

                alert(
                    "This Register Number already exists in this college!"
                );

                return;

            }


            // ------------------------------------------
            // New Student Object
            // ------------------------------------------

            const newStudent = {

                id:
                    Date.now(),

                regNo:
                    regNo,

                name:
                    name,

                phone:
                    phone,

                dob:
                    dob,

                department:
                    department,

                collegeCode:
                    collegeCode,

                year:
                    year,

                semester:
                    semester,

                avatar:
                    "no_image",

                historyPresent:
                    0,

                historyTotal:
                    0,

                attendance:
                    []

            };


            // ------------------------------------------
            // Save LocalStorage
            // ------------------------------------------

            currentStudents.push(
                newStudent
            );


            localStorage.setItem(
                "attendance_students",
                JSON.stringify(
                    currentStudents
                )
            );


            // ------------------------------------------
            // Save Firebase
            // ------------------------------------------

            try {

                await addDoc(
                    collection(
                        db,
                        "students"
                    ),
                    {

                        regNo:
                            newStudent.regNo,

                        name:
                            newStudent.name,

                        phone:
                            newStudent.phone,

                        dob:
                            newStudent.dob,

                        department:
                            newStudent.department,

                        collegeCode:
                            newStudent.collegeCode,

                        year:
                            newStudent.year,

                        semester:
                            newStudent.semester,

                        avatar:
                            newStudent.avatar,

                        historyPresent:
                            0,

                        historyTotal:
                            0,

                        attendance:
                            [],

                        createdAt:
                            new Date()
                                .toISOString()

                    }
                );


                console.log(
                    "Student saved to Firebase successfully."
                );


            } catch (error) {

                console.error(
                    "Firebase student save error:",
                    error
                );


                alert(
                    "Student saved locally, but Firebase save failed."
                );

            }


            // ------------------------------------------
            // Success
            // ------------------------------------------

            alert(
                "Student Registered Successfully!"
            );


            studentRegisterForm.reset();


            // Refresh department list
            updateRegisterDepartment();


            // Close popup
            closeStudentRegisterPopup();

        }
    );

}


// ======================================================
// DOM READY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Smart Attendance System loaded."
        );


        // Load college details
        loadCollegeDetails();


        // Update student registration departments
        updateRegisterDepartment();

    }
);


// ======================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ======================================================

window.openStudentRegisterPopup =
    openStudentRegisterPopup;


window.closeStudentRegisterPopup =
    closeStudentRegisterPopup;


window.updateRegisterDepartment =
    updateRegisterDepartment;