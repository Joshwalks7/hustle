/* --- Templates --- */
const loginHTML = `
    <h2>Login</h2>
    <form id="loginForm">
        <div class="form-group"><label>Email</label><input type="email" id="lEmail" required></div>
        <div class="form-group"><label>Password</label><input type="password" id="lPass" required></div>
        <button type="submit" class="btn-primary" style="width:100%">Login</button>
    </form>
    <p>New? <a href="#" id="toSignup">Create account</a></p>`;

const signupHTML = `
    <h2>Create Account</h2>
    <form id="signupForm">
        <div class="form-group"><label>Name</label><input type="text" id="sName" required></div>
        <div class="form-group"><label>Email</label><input type="email" id="sEmail" required></div>
        <div class="form-group"><label>Password</label><input type="password" id="sPass" required></div>
        <div class="form-group"><label>Role</label><select id="sRole"><option value="seeker">Job Seeker</option><option value="employer">Employer</option></select></div>
        <button type="submit" class="btn-primary" style="width:100%">Sign Up</button>
    </form>
    <p>Existing? <a href="#" id="toLogin">Login</a></p>`;

const postJobHTML = `
    <h2>Post a Listing</h2>
    <form id="postJobForm">
        <div class="form-group"><label>Job Title</label><input type="text" id="jTitle" required></div>
        <div class="form-group"><label>Description</label><textarea id="jDesc" required></textarea></div>
        <div class="form-group"><label>Budget ($)</label><input type="number" id="jPrice" required></div>
        <button type="submit" class="btn-primary" style="width:100%">Post Now</button>
    </form>`;

/* --- Storage Helpers --- */
const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
const getJobs = () => JSON.parse(localStorage.getItem('jobs')) || [];
const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));

/* --- UI Logic --- */
const modal = document.getElementById("authModal");
const container = document.getElementById("modalContainer");
const closeBtn = document.querySelector(".close");

function setupToggle() {
    if(document.getElementById("toSignup")) document.getElementById("toSignup").onclick = () => { container.innerHTML = signupHTML; setupToggle(); };
    if(document.getElementById("toLogin")) document.getElementById("toLogin").onclick = () => { container.innerHTML = loginHTML; setupToggle(); };
}

document.getElementById("loginBtn").onclick = () => { container.innerHTML = loginHTML; modal.style.display = "block"; setupToggle(); };
document.getElementById("signupBtn").onclick = () => { container.innerHTML = signupHTML; modal.style.display = "block"; setupToggle(); };
closeBtn.onclick = () => modal.style.display = "none";

// View Listings Logic
document.getElementById("viewListings").onclick = (e) => {
    e.preventDefault();
    const main = document.getElementById("mainContent");
    main.innerHTML = `
        <div style="text-align:center; padding: 40px 5%;">
            <h1>Marketplace Listings</h1>
            <button id="btnPost" class="btn-primary">Post New Job +</button>
        </div>
        <div id="listingsContainer"></div>`;
    
    document.getElementById("btnPost").onclick = () => {
        if(!getCurrentUser()) return alert("Please login first!");
        container.innerHTML = postJobHTML;
        modal.style.display = "block";
    };

    const list = document.getElementById("listingsContainer");
    const jobs = getJobs();
    if(jobs.length === 0) list.innerHTML = "<p>No jobs found.</p>";
    jobs.forEach((job, i) => {
        list.innerHTML += `
            <div class="job-card">
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <div class="price">$${job.price}</div>
                <button class="btn-secondary contact-btn" data-id="${i}">Message Lister</button>
            </div>`;
    });
};

/* --- Global Form Submits --- */
document.addEventListener("submit", (e) => {
    e.preventDefault();
    if(e.target.id === "signupForm") {
        const newUser = { name: sName.value, email: sEmail.value, password: sPass.value, role: sRole.value };
        const users = getUsers();
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert("Success! Now login.");
        container.innerHTML = loginHTML;
    }

    if(e.target.id === "loginForm") {
        const user = getUsers().find(u => u.email === lEmail.value && u.password === lPass.value);
        if(user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            location.reload();
        } else alert("Error!");
    }

    if(e.target.id === "postJobForm") {
        const jobs = getJobs();
        jobs.push({ title: jTitle.value, description: jDesc.value, price: jPrice.value, employer: getCurrentUser().name });
        localStorage.setItem('jobs', JSON.stringify(jobs));
        modal.style.display = "none";
        document.getElementById("viewListings").click();
    }
});

// Update Nav on Load
window.onload = () => {
    const user = getCurrentUser();
    if(user) {
        document.getElementById("navLinks").innerHTML = `
            <li><a href="#" id="viewListings">Browse</a></li>
            <li><span>Hi, ${user.name}</span></li>
            <li><button id="logout" class="btn-secondary">Logout</button></li>`;
        document.getElementById("logout").onclick = () => { localStorage.removeItem('currentUser'); location.reload(); };
        document.getElementById("viewListings").onclick = (e) => { /* reuse logic above */ location.reload(); };
    }
};