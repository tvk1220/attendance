import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// ======================================================
// COLLEGE-WISE STUDENT REGISTRATION CONTROL
// ======================================================


// ======================================================
// GET LOGGED-IN COLLEGE CODE
// ======================================================

function getLoggedInCollegeCode() {

    return String(
        localStorage.getItem("loggedInCollegeCode") || ""
    ).trim();

}


// ======================================================
// GET CURRENT TEACHER DEPARTMENT
// ======================================================

function getCurrentTeacherDepartment() {

    return String(
        localStorage.getItem(
            "loggedInTeacherDepartment"
        ) || ""
    )
        .trim()
        .toUpperCase();

}

// ======================================================
// SHOW TEACHER DEPARTMENT IN SIDEBAR
// ======================================================

function setTeacherDepartmentDisplay() {

    const department =
        getCurrentTeacherDepartment();

    const departmentDisplay =
        document.getElementById(
            "teacherDepartmentDisplay"
        );

    const portalSubTitle =
        document.getElementById(
            "portalSubTitle"
        );


    if (departmentDisplay) {

        departmentDisplay.textContent =
            department
                ? `${department} Teacher`
                : "Teacher Portal";

    }


    if (portalSubTitle) {

        portalSubTitle.textContent =
            department
                ? `${department} Department`
                : "Teacher Portal";

    }

}


// ======================================================
// GET COLLEGE-SPECIFIC STORAGE KEY
// ======================================================

function getDepartmentStorageKey() {

    const collegeCode =
        getLoggedInCollegeCode();

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

        const storedData =
            localStorage.getItem(
                storageKey
            );

        if (!storedData) {
            return [];
        }

        const departments =
            JSON.parse(storedData);

        if (!Array.isArray(departments)) {
            return [];
        }

        return departments.map(
            department =>
                String(department)
                    .trim()
                    .toUpperCase()
        );

    } catch (error) {

        console.error(
            "Error reading enabled departments:",
            error
        );

        return [];

    }

}


// ======================================================
// SAVE ENABLED DEPARTMENTS
// CURRENT COLLEGE ONLY
// ======================================================

function saveEnabledStudentDepartments(
    departments
) {

    const storageKey =
        getDepartmentStorageKey();

    if (!storageKey) {

        alert(
            "College details not found. Please login again."
        );

        return false;
    }

    const cleanDepartments =
        Array.from(
            new Set(
                departments.map(
                    department =>
                        String(department)
                            .trim()
                            .toUpperCase()
                )
            )
        );


    localStorage.setItem(
        storageKey,
        JSON.stringify(
            cleanDepartments
        )
    );


    console.log(
        "Saved departments for college:",
        getLoggedInCollegeCode(),
        cleanDepartments
    );


    return true;

}


// ======================================================
// ENABLE / DISABLE STUDENT REGISTER
// ======================================================

function toggleStudentRegister() {

    const collegeCode =
        getLoggedInCollegeCode();

    if (!collegeCode) {

        alert(
            "College details not found. Please login again."
        );

        return;
    }


    const teacherDepartment =
        getCurrentTeacherDepartment();

    if (!teacherDepartment) {

        alert(
            "Teacher department not found. Please login again."
        );

        return;
    }


    let enabledDepartments =
        getEnabledStudentDepartments();


    // ==================================================
    // IF ALREADY ENABLED → DISABLE
    // ==================================================

    if (
        enabledDepartments.includes(
            teacherDepartment
        )
    ) {

        enabledDepartments =
            enabledDepartments.filter(
                department =>
                    department !==
                    teacherDepartment
            );


        saveEnabledStudentDepartments(
            enabledDepartments
        );


        alert(
            teacherDepartment +
            " Student Registration Disabled"
        );

    }


    // ==================================================
    // IF NOT ENABLED → ENABLE
    // ==================================================

    else {

        enabledDepartments.push(
            teacherDepartment
        );


        saveEnabledStudentDepartments(
            enabledDepartments
        );


        alert(
            teacherDepartment +
            " Student Registration Enabled"
        );

    }


    updateEnableStudentRegisterButton();

}


// ======================================================
// UPDATE ENABLE BUTTON UI
// ======================================================

function updateEnableStudentRegisterButton() {

    const button =
        document.getElementById(
            "enableStudentRegisterBtn"
        );

    if (!button) {
        return;
    }


    const teacherDepartment =
        getCurrentTeacherDepartment();


    const enabledDepartments =
        getEnabledStudentDepartments();


    // ==================================================
    // ENABLED
    // ==================================================

    if (
        teacherDepartment &&
        enabledDepartments.includes(
            teacherDepartment
        )
    ) {

        button.innerHTML = `
            <i class="fa-solid fa-user-check"></i>
            Disable Student Register
        `;


        button.classList.remove(
            "text-blue-600",
            "hover:bg-blue-50"
        );


        button.classList.add(
            "text-red-600",
            "hover:bg-red-50"
        );

    }


    // ==================================================
    // DISABLED
    // ==================================================

    else {

        button.innerHTML = `
            <i class="fa-solid fa-user-plus"></i>
            Enable Student Register
        `;


        button.classList.remove(
            "text-red-600",
            "hover:bg-red-50"
        );


        button.classList.add(
            "text-blue-600",
            "hover:bg-blue-50"
        );

    }

}


// ======================================================
// dom LOAD PAGE
// ======================================================
document.addEventListener(
    "DOMContentLoaded",
    function () {
        setTeacherDepartmentDisplay();
        updateEnableStudentRegisterButton();

        const yearSelect =
            document.getElementById("yearSelect");

        const semesterSelect =
            document.getElementById("semesterSelect");


        if (yearSelect) {

            yearSelect.addEventListener(
                "change",
                loadStudentsForAttendance
            );

        }


        if (semesterSelect) {

            semesterSelect.addEventListener(
                "change",
                loadStudentsForAttendance
            );

        }

    }
);

// ======================================================
// LOGOUT
// ======================================================

function logout() {

    // Remove current login details

    localStorage.removeItem(
        "loggedInTeacherName"
    );

    localStorage.removeItem(
        "loggedInTeacherDepartment"
    );

    localStorage.removeItem(
        "loggedInTeacherCollegeCode"
    );

    localStorage.removeItem(
        "loggedInStudentRegNo"
    );

    localStorage.removeItem(
        "loggedInStudentCollegeCode"
    );

    localStorage.removeItem(
        "loggedInStudentDepartment"
    );

    localStorage.removeItem(
        "loggedInStudentYear"
    );

    localStorage.removeItem(
        "loggedInStudentSemester"
    );

    localStorage.removeItem(
        "userRole"
    );

    localStorage.removeItem(
        "loggedInCollegeCode"
    );


    window.location.href =
        "index.html";

}

// ======================================================
// HISTORY MODAL
// ======================================================

function openHistoryModal() {

    const modal =
        document.getElementById("historyModal");

    if (!modal) {
        console.error("historyModal not found");
        return;
    }

    modal.classList.remove("hidden");
}


// ======================================================
// CLOSE HISTORY MODAL
// ======================================================

function closeHistoryModal() {

    const modal =
        document.getElementById("historyModal");

    if (modal) {
        modal.classList.add("hidden");
    }
}

// ======================================================
// RENDER MANAGE STUDENTS LIST
// ======================================================

async function renderModalStudentList() {

    const list =
        document.getElementById(
            "modalStudentList"
        );

    if (!list) {
        return;
    }

    const collegeCode =
        getLoggedInCollegeCode();

    const teacherDepartment =
        getCurrentTeacherDepartment();


    if (!collegeCode || !teacherDepartment) {

        list.innerHTML = `
            <div class="p-4 text-center text-slate-400 text-xs">
                College or Department not found.
            </div>
        `;

        return;
    }


    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        const studentsQuery =
            query(
                studentsRef,
                where(
                    "collegeCode",
                    "==",
                    collegeCode
                )
            );


        const snapshot =
            await getDocs(
                studentsQuery
            );


        const students = [];


        snapshot.forEach(
            studentDoc => {

                const student =
                    studentDoc.data();


                const department =
                    String(
                        student.department || ""
                    )
                    .trim()
                    .toUpperCase();


                if (
                    department ===
                    teacherDepartment
                ) {

                    students.push({
                        id: studentDoc.id,
                        ...student
                    });

                }

            }
        );


        // Sort by Register Number
        students.sort(
            (a, b) =>
                String(a.regNo || "")
                    .localeCompare(
                        String(b.regNo || ""),
                        undefined,
                        {
                            numeric: true
                        }
                    )
        );


        list.innerHTML = "";


        if (students.length === 0) {

            list.innerHTML = `
                <div class="p-5 text-center text-slate-400 text-xs">
                    No students registered for ${teacherDepartment}.
                </div>
            `;

            return;
        }


        students.forEach(
            (student, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "p-3 flex items-center justify-between gap-3";


                item.innerHTML = `

                    <div class="min-w-0">

                        <p class="text-xs font-bold text-slate-700 truncate">
                            ${index + 1}. ${student.studentName || ""}
                        </p>

                        <p class="text-[10px] text-slate-400">
                            ${student.regNo || ""}
                            •
                            ${student.year || ""}
                            •
                            ${student.semester || ""}
                        </p>

                    </div>

                    <span class="text-[10px] font-bold
                                 bg-blue-50 text-blue-600
                                 px-2 py-1 rounded-lg">
                        ${student.department || ""}
                    </span>

                `;


                list.appendChild(item);

            }
        );


        console.log(
            "Manage Students loaded:",
            students
        );

    }

    catch (error) {

        console.error(
            "Error loading student list:",
            error
        );


        list.innerHTML = `
            <div class="p-5 text-center text-red-500 text-xs">
                Failed to load students.
            </div>
        `;

    }

}


// ======================================================
// ADD STUDENT MODAL
// ======================================================

function openAddStudentModal() {

    const teacherDepartment =
        getCurrentTeacherDepartment();

    const enabledDepartments =
        getEnabledStudentDepartments();


    // Teacher department must be enabled
    if (
        !enabledDepartments.includes(
            teacherDepartment
        )
    ) {

        alert(
            "Student Registration is disabled. Please enable it first."
        );

        return;
    }


    const modal =
        document.getElementById(
            "addStudentModal"
        );


    if (!modal) {

        console.error(
            "addStudentModal not found"
        );

        return;
    }


    modal.classList.remove(
        "hidden"
    );


    // Update department dropdown if function exists
    if (
        typeof updateRegisterDepartment ===
        "function"
    ) {

        updateRegisterDepartment();

    }


    // Render student list if function exists
    if (
        typeof renderModalStudentList ===
        "function"
    ) {

        renderModalStudentList();

    }

}


// ======================================================
// CLOSE ADD STUDENT MODAL
// ======================================================

function closeAddStudentModal() {

    const modal =
        document.getElementById(
            "addStudentModal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


// ======================================================
// UPDATE REGISTER DEPARTMENT
// ======================================================

function updateRegisterDepartment() {

    const departmentSelect =
        document.getElementById(
            "registerDepartment"
        );


    if (!departmentSelect) {

        console.error(
            "registerDepartment not found"
        );

        return;
    }


    const enabledDepartments =
        getEnabledStudentDepartments();


    departmentSelect.innerHTML = "";


    // Default option
    const defaultOption =
        document.createElement(
            "option"
        );

    defaultOption.value = "";

    defaultOption.textContent =
        "Select Department";

    departmentSelect.appendChild(
        defaultOption
    );


    // All departments
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


            // Only enabled departments selectable
            option.disabled =
                !enabledDepartments.includes(
                    department
                );


            departmentSelect.appendChild(
                option
            );

        }
    );

}

// ======================================================
// STUDENT DETAILS MODAL
// ======================================================

function openDetailsModal() {

    const modal =
        document.getElementById("detailsModal");

    if (!modal) {
        console.error("detailsModal not found");
        return;
    }

    modal.classList.remove("hidden");

    if (typeof renderDetailsTable === "function") {
        renderDetailsTable();
    }
}


// ======================================================
// CLOSE STUDENT DETAILS MODAL
// ======================================================

function closeDetailsModal() {

    const modal =
        document.getElementById("detailsModal");

    if (modal) {
        modal.classList.add("hidden");
    }
}

// ======================================================
// LOAD STUDENTS BY DEPARTMENT + YEAR + SEMESTER
// ======================================================

async function loadStudentsForAttendance() {

    const collegeCode =
        getLoggedInCollegeCode();

    const department =
        getCurrentTeacherDepartment();

    const year =
        String(
            document.getElementById("yearSelect")?.value || ""
        ).trim();

    const semester =
        String(
            document.getElementById("semesterSelect")?.value || ""
        ).trim();

    const tableBody =
        document.getElementById("attendanceTableBody");

    const totalCount =
        document.getElementById("totalStudentsCount");


    if (!tableBody) {
        return;
    }


    // Year / Semester select செய்யவில்லை
    if (!year || !semester) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    class="p-6 text-center text-slate-400">
                    Please select Year and Semester
                </td>
            </tr>
        `;

        if (totalCount) {
            totalCount.textContent = "0";
        }

        return;
    }


    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        const studentsQuery =
            query(
                studentsRef,
                where(
                    "collegeCode",
                    "==",
                    collegeCode
                )
            );


        const snapshot =
            await getDocs(
                studentsQuery
            );


        const students = [];


        snapshot.forEach(
            doc => {

                const student =
                    doc.data();


                const studentDepartment =
                    String(
                        student.department || ""
                    )
                    .trim()
                    .toUpperCase();


                const studentYear =
                    String(
                        student.year || ""
                    ).trim();


                const studentSemester =
                    String(
                        student.semester || ""
                    ).trim();

                    console.log("TEACHER:", department);
console.log("SELECTED YEAR:", year);
console.log("SELECTED SEMESTER:", semester);

console.log("STUDENT:", {
    department: studentDepartment,
    year: studentYear,
    semester: studentSemester,
    regNo: student.regNo,
    name: student.studentName
});


                if (
                    studentDepartment === department &&
                    studentYear === year &&
                    studentSemester === semester
                ) {

                    students.push({
                        id: doc.id,
                        ...student
                    });

                }

            }
        );


        // Register number order
        students.sort(
            (a, b) =>
                String(a.regNo || "")
                    .localeCompare(
                        String(b.regNo || ""),
                        undefined,
                        {
                            numeric: true
                        }
                    )
        );


        tableBody.innerHTML = "";


        if (totalCount) {
            totalCount.textContent =
                students.length;
        }


        if (students.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="8"
                        class="p-6 text-center text-slate-400">
                        No students found for
                        ${department} - ${year} - ${semester}
                    </td>
                </tr>
            `;

            return;
        }


        students.forEach(
            (student, index) => {

                const row =
                    document.createElement("tr");

                row.className =
                    "hover:bg-slate-50";


                row.innerHTML = `

                    <td class="p-4 text-center">
                        ${index + 1}
                    </td>

                    <td class="p-4 font-semibold">
                        ${student.regNo || ""}
                    </td>

                    <td class="p-4">
                        ${student.studentName || ""}
                    </td>

                    ${[1, 2, 3, 4, 5].map(
                        hour => `
                            <td class="p-4 text-center">
                                <button
                                    type="button"
                                    class="attendance-btn
                                           px-3 py-1 rounded-lg
                                           bg-green-100
                                           text-green-700
                                           font-bold"
                                    data-student-id="${student.id}"
                                    data-hour="${hour}">
                                    P
                                </button>
                            </td>
                        `
                    ).join("")}

                `;


                tableBody.appendChild(row);

            }
        );


        console.log(
            "Attendance students loaded:",
            department,
            year,
            semester,
            students
        );

    }

    catch (error) {

        console.error(
            "Error loading attendance students:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    class="p-6 text-center text-red-500">
                    Failed to load students
                </td>
            </tr>
        `;

    }

}
// ======================================================
// STUDENT REGISTRATION - SAVE STUDENT
// ======================================================

async function registerNewStudent(event) {

    event.preventDefault();

    try {

        // ==================================================
        // LOGIN DETAILS
        // ==================================================

        const collegeCode =
            getLoggedInCollegeCode();

        const teacherDepartment =
            getCurrentTeacherDepartment();


        if (!collegeCode) {

            alert(
                "College details not found. Please login again."
            );

            return;
        }


        if (!teacherDepartment) {

            alert(
                "Teacher department not found. Please login again."
            );

            return;
        }


        // ==================================================
        // CHECK DEPARTMENT ENABLED
        // ==================================================

        const enabledDepartments =
            getEnabledStudentDepartments();


        if (
            !enabledDepartments.includes(
                teacherDepartment
            )
        ) {

            alert(
                "Student Registration is disabled for this department."
            );

            return;
        }


        // ==================================================
        // GET FORM VALUES
        // ==================================================

        const department =
            String(
                document.getElementById(
                    "registerDepartment"
                )?.value || ""
            )
            .trim()
            .toUpperCase();


        const regNo =
            String(
                document.getElementById(
                    "registerRegNo"
                )?.value || ""
            )
            .trim();


        const studentName =
            String(
                document.getElementById(
                    "registerStudentName"
                )?.value || ""
            )
            .trim();


        const phone =
            String(
                document.getElementById(
                    "registerPhone"
                )?.value || ""
            )
            .trim();


        const dob =
            String(
                document.getElementById(
                    "registerDob"
                )?.value || ""
            )
            .trim();


        const year =
            String(
                document.getElementById(
                    "registerYear"
                )?.value || ""
            )
            .trim();


        const semester =
            String(
                document.getElementById(
                    "registerSemester"
                )?.value || ""
            )
            .trim();


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            !department ||
            !regNo ||
            !studentName ||
            !phone ||
            !dob ||
            !year ||
            !semester
        ) {

            alert(
                "Please fill all student details."
            );

            return;
        }


        if (
            !enabledDepartments.includes(
                department
            )
        ) {

            alert(
                "Selected department is not enabled."
            );

            return;
        }


        // ==================================================
        // CHECK DUPLICATE REGISTER NUMBER
        // SAME COLLEGE + SAME DEPARTMENT
        // ==================================================

        const studentsRef =
            collection(
                db,
                "students"
            );


        const duplicateQuery =
            query(
                studentsRef,
                where(
                    "collegeCode",
                    "==",
                    collegeCode
                )
            );


        const existingStudents =
            await getDocs(
                duplicateQuery
            );


        let duplicateFound = false;


        existingStudents.forEach(
            studentDoc => {

                const student =
                    studentDoc.data();


                const existingRegNo =
                    String(
                        student.regNo || ""
                    )
                    .trim()
                    .toLowerCase();


                const existingDepartment =
                    String(
                        student.department || ""
                    )
                    .trim()
                    .toUpperCase();


                if (
                    existingRegNo ===
                    regNo.toLowerCase()
                    &&
                    existingDepartment ===
                    department
                ) {

                    duplicateFound = true;

                }

            }
        );


        if (duplicateFound) {

            alert(
                "This Register Number already exists in this department."
            );

            return;
        }


        // ==================================================
        // STUDENT DATA
        // ==================================================

const studentData = {

    collegeCode:
        collegeCode,

    // Teacher login செய்த department
    department:
        teacherDepartment,

    regNo:
        regNo,

    studentName:
        studentName,

    phone:
        phone,

    dob:
        dob,

    year:
        year,

    semester:
        semester,

    // Example:
    // MCA_1st Year_1st Semester
    studentGroupKey:
        `${teacherDepartment}_${year}_${semester}`,

    createdByTeacher:
        localStorage.getItem(
            "loggedInTeacherName"
        ) || "",

    createdAt:
        new Date().toISOString()

};

        // ==================================================
        // SAVE TO FIRESTORE
        // ==================================================

        const studentDoc =
            await addDoc(
                studentsRef,
                studentData
            );


        console.log(
            "Student saved to Firestore:",
            studentDoc.id
        );


        // ==================================================
        // SAVE TO LOCAL STORAGE
        // ==================================================

        let localStudents =
            JSON.parse(
                localStorage.getItem(
                    "attendance_students"
                ) || "[]"
            );


        localStudents.push(
            studentData
        );


        localStorage.setItem(
            "attendance_students",
            JSON.stringify(
                localStudents
            )
        );


        // ==================================================
        // SUCCESS
        // ==================================================

        alert(
            studentName +
            " registered successfully!"
        );


        // ==================================================
        // RESET FORM
        // ==================================================

        const form =
            document.getElementById(
                "studentRegisterForm"
            );


        if (form) {
            form.reset();
        }


        // ==================================================
        // CLOSE POPUP
        // ==================================================

        closeStudentRegisterPopup();


        // ==================================================
        // REFRESH STUDENT LIST
        // ==================================================

        if (
            typeof renderModalStudentList ===
            "function"
        ) {

            renderModalStudentList();

        }


        // ==================================================
        // REFRESH ATTENDANCE TABLE
        // ==================================================

        if (
            typeof renderTable ===
            "function"
        ) {

            renderTable();

        }

    }

    catch (error) {

        console.error(
            "Student registration error:",
            error
        );


        alert(
            "Student registration failed. Please try again."
        );

    }

}

// CLOSE STUDENT REGISTER POPUP
// ======================================================

function closeStudentRegisterPopup() {

    const popup =
        document.getElementById(
            "studentRegisterPopup"
        );

    if (popup) {

        popup.classList.add(
            "hidden"
        );

        popup.classList.remove(
            "flex"
        );

    }

}

// ======================================================
// STUDENT REGISTRATION FORM EVENT
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById(
                "studentRegisterForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                registerNewStudent
            );

        }

    }
);

// ======================================================
// MAKE AVAILABLE TO HTML
// ======================================================

window.openDetailsModal =
    openDetailsModal;

window.closeDetailsModal =
    closeDetailsModal;

// ======================================================
// HISTORY FUNCTIONS FOR HTML
// ======================================================

window.openHistoryModal = openHistoryModal;
window.closeHistoryModal = closeHistoryModal;

// ======================================================
// ======================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ======================================================

window.toggleStudentRegister =
    toggleStudentRegister;

window.updateEnableStudentRegisterButton =
    updateEnableStudentRegisterButton;

window.openAddStudentModal =
    openAddStudentModal;

window.closeAddStudentModal =
    closeAddStudentModal;

window.updateRegisterDepartment =
    updateRegisterDepartment;

window.openHistoryModal =
    openHistoryModal;

window.closeHistoryModal =
    closeHistoryModal;

window.openDetailsModal =
    openDetailsModal;

window.closeDetailsModal =
    closeDetailsModal;
window.registerNewStudent =
    registerNewStudent;

window.closeStudentRegisterPopup =
    closeStudentRegisterPopup;

    window.loadStudentsForAttendance =
    loadStudentsForAttendance;
window.logout =
    logout;

window.logout =
    logout;


