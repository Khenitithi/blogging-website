const cartoons=[
{name:"Doraemon",category:"Comedy",image:"https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80",description:"A futuristic robotic cat who uses amazing gadgets to help his friend Nobita."},
{name:"Adventure World",category:"Adventure",image:"https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=900&q=80",description:"An imaginary animated adventure filled with mystery, exploration and exciting journeys."},
{name:"Anime Hero",category:"Anime",image:"https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=900&q=80",description:"A fictional anime-inspired hero learning courage, friendship and responsibility."},
{name:"Super Toon",category:"Superhero",image:"https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=900&q=80",description:"A cartoon superhero who uses creativity and courage to protect the city."},
{name:"Classic Friends",category:"Classic",image:"https://images.unsplash.com/photo-1594736797933-d0cde7f7b11d?auto=format&fit=crop&w=900&q=80",description:"A nostalgic cartoon-style story about friendship, fun and everyday adventures."},
{name:"Fantasy Land",category:"Fantasy",image:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80",description:"A magical animated world full of imagination, strange creatures and colorful stories."}
];

function getFavorites(){return JSON.parse(localStorage.getItem("toonFavorites")||"[]")}
function saveFavorites(a){localStorage.setItem("toonFavorites",JSON.stringify(a))}
function isLogged(){return !!localStorage.getItem("toonUser")}
function toggleMenu(){document.querySelector(".nav-links")?.classList.toggle("show")}

function updateAuth(){
 const link=document.getElementById("authLink");
 if(link && isLogged()){link.textContent="Profile";link.href="profile.html"}
}
function card(c){
 const active=getFavorites().includes(c.name);
 return `<article class="cartoon-card">
 <img class="card-img" src="${c.image}" alt="${c.name}">
 <div class="card-body"><span class="tag">${c.category}</span><h3>${c.name}</h3><p>${c.description}</p>
 <div class="card-actions"><a class="small-btn" href="cartoon-details.html?name=${encodeURIComponent(c.name)}">Details</a>
 <button class="small-btn fav-btn ${active?"active":""}" onclick="toggleFavorite('${c.name.replaceAll("'","\\'")}')">${active?"♥ Saved":"♡ Favorite"}</button></div></div></article>`
}
function renderFeatured(){const el=document.getElementById("featuredGrid");if(el)el.innerHTML=cartoons.slice(0,3).map(card).join("")}
function renderCartoons(){
 const el=document.getElementById("cartoonGrid");if(!el)return;
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
 const cat=document.getElementById("categoryFilter")?.value||"All";
 const data=cartoons.filter(c=>(cat==="All"||c.category===cat)&&c.name.toLowerCase().includes(q));
 el.innerHTML=data.length?data.map(card).join(""):`<div class="empty">No cartoons found. Try another search.</div>`;
}
function renderFavorites(){
 const el=document.getElementById("favoriteGrid");if(!el)return;
 const fav=getFavorites();const data=cartoons.filter(c=>fav.includes(c.name));
 el.innerHTML=data.length?data.map(card).join(""):`<div class="empty">No favorites yet. <a href="cartoons.html">Explore cartoons →</a></div>`;
}
function toggleFavorite(name){
 if(!isLogged()){alert("Please login first to save favorites.");location.href="login.html";return}
 let fav=getFavorites();
 if(fav.includes(name))fav=fav.filter(x=>x!==name);else fav.push(name);
 saveFavorites(fav);renderCartoons();renderFeatured();renderFavorites();
}
function logout(){localStorage.removeItem("toonUser");location.href="index.html"}

function setupAuth(){
 const login=document.getElementById("loginForm");
 if(login)login.addEventListener("submit",e=>{
   e.preventDefault();
   let ok=true;const email=document.getElementById("loginEmail").value.trim(),pass=document.getElementById("loginPassword").value;
   document.getElementById("loginEmailError").textContent="";document.getElementById("loginPasswordError").textContent="";
   if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)){document.getElementById("loginEmailError").textContent="Enter a valid email.";ok=false}
   if(pass.length<6){document.getElementById("loginPasswordError").textContent="Password must be at least 6 characters.";ok=false}
   const user=JSON.parse(localStorage.getItem("toonUser"));
   if(ok && user && user.email===email && user.password===pass){location.href="index.html"}
   else if(ok){document.getElementById("loginPasswordError").textContent="Invalid login details. Register first or check your password."}
 });
 const reg=document.getElementById("registerForm");
 if(reg)reg.addEventListener("submit",e=>{
   e.preventDefault();let ok=true;
   const name=document.getElementById("regName").value.trim(),email=document.getElementById("regEmail").value.trim(),pass=document.getElementById("regPassword").value,confirm=document.getElementById("regConfirm").value;
   document.querySelectorAll(".error").forEach(x=>x.textContent="");
   if(name.length<2){document.getElementById("regNameError").textContent="Enter your name.";ok=false}
   if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)){document.getElementById("regEmailError").textContent="Enter a valid email.";ok=false}
   if(pass.length<6){document.getElementById("regPasswordError").textContent="Use at least 6 characters.";ok=false}
   if(pass!==confirm){document.getElementById("regConfirmError").textContent="Passwords do not match.";ok=false}
   if(ok){localStorage.setItem("toonUser",JSON.stringify({name,email,password:pass}));alert("Account created successfully!");location.href="index.html"}
 });
}
function renderProfile(){
 const u=JSON.parse(localStorage.getItem("toonUser")||"null");if(!u){location.href="login.html";return}
 const n=document.getElementById("profileName"),e=document.getElementById("profileEmail");if(n)n.textContent=u.name;if(e)e.textContent=u.email;
}
function renderDetails(){
 const el=document.getElementById("detail");if(!el)return;
 const name=new URLSearchParams(location.search).get("name");const c=cartoons.find(x=>x.name===name)||cartoons[0];
 el.innerHTML=`<div class="detail-card"><img src="${c.image}" alt="${c.name}"><div><span class="tag">${c.category}</span><h1>${c.name}</h1><p>${c.description}</p><p><strong>About this cartoon:</strong> This entry is part of the ToonVerse collection. Explore the category, read related blogs and save it to your favorites.</p><button class="btn" onclick="toggleFavorite('${c.name}')">${getFavorites().includes(c.name)?"♥ Saved to Favorites":"♡ Add to Favorites"}</button></div></div>`;
}
document.addEventListener("DOMContentLoaded",()=>{updateAuth();renderFeatured();renderCartoons();renderFavorites();renderProfile();renderDetails();setupAuth()});