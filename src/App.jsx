import { useEffect, useState } from 'react'
import Profile from './Profile';
import './App.css'

function RandomUser() {
const [gender, setGender] = useState("");
const [name, setName] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [image, setImage] = useState("");
const [location, setLocation] = useState("");
const [username, setUserName] = useState("");
const [password, setPassword] = useState("");
const [age, setAge] = useState(0);
const [darkTheme, setDarkTheme] = useState(false);
const [loggedIn, setLoggedIn] = useState(false);
const [UserLogin, setUserLogin] = useState("");
const [userPassword, setUserPassword] = useState("");
const [registrationForm, setRegistartionForm] = useState(true);
const [errorMessage, setErrorMessage] = useState("");
const [profile, setProfile] = useState(false);
const [withoutRegistration, setWithoutRegistration] = useState(false);
const [exit, setExit] = useState(false);
const [goToProfile, setGoToProfile] = useState(false);
async function Register() {
  if(UserLogin.trim() === "") {

    setErrorMessage("Username can't be empty!");
    return;
  }
  if(userPassword.trim() === "") {
    setErrorMessage("Password can't be empty!");
    return;
  }
  try {
  const res = await fetch("http://localhost:3000/register", {
    method : 'POST',
    headers : {'Content-Type' : 'application/json'},
    body : JSON.stringify({UserLogin, userPassword}),
  });
  if(!res.ok) {
    throw new Error("Error sending data on server!");
  }
const data = await res.json();
if(data.success == 1) {
  setLoggedIn(true);
  setErrorMessage("");
}
else {
  setLoggedIn(false);
  setErrorMessage("Account with this email already exists.");
}
} catch(error) {
  console.error(error);
}
}
async function LogIn() {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method:'POST',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify({UserLogin, userPassword}),
    });
    if(!res.ok) {
      throw new Error("Error sending data on server");
    }
    const data = await res.json();
     console.log(data.success); 
    if(data.success) {
      setErrorMessage("");
      setLoggedIn(true);
      return;
  }
    setErrorMessage("Invalid credentials.");
    setLoggedIn(false);
    
 
}
  catch(error) {
    console.error(error);
  }  
}
async function SaveUser() {
  if(withoutRegistration === true) {
    setErrorMessage("You can't save a user without account");
    return;
  }
  console.log(gender, name, phoneNumber, image,password, age, UserLogin);
try {
  const res = await fetch("http://localhost:3000/save-user", {
    method : 'POST',
    headers : {'Content-Type' : 'application/json'},
    body: JSON.stringify({gender, name, phoneNumber, image, username, password, age, UserLogin}),
  });
  if(!res.ok) {
    throw new Error("Error sending data on server");
  }
  const data = await res.json();
  if(data.success) {
    setErrorMessage("User was successfully saved");
  document.getElementById("error").classList.replace("text-red-400", "text-white/40");
  setTimeout(() => {
    document.getElementById("error").classList.replace("text-white/40", "text-red-400");
    setErrorMessage("");
  }, 5000);
    
  }
}
  catch(error) {
    console.error(error);
  }

}
  async function getRandomUser() {
      try {
        const res = await fetch("http://localhost:3000/user");
        if(!res.ok) {
          throw new Error("Error fetching data from server!");
        }
        const data = await res.json();
        const {results,} = data;
       const {0 : gender} = results;
       const {cell, name} = gender;
       console.log(gender);
       setGender(gender.gender);
        setName(name.title + " " + name.first + " " + name.last);
        setPhoneNumber(cell);
        setImage(gender.picture.large);
        setLocation(gender.location.street.name + " " +  gender.location.street.number 
          + ", " + gender.location.city + ", " 
          + gender.location.state + ", "
          + gender.location.country);
          setUserName(gender.login.username);
          setPassword(gender.login.password);
          setAge(gender.dob.age);

      }
      catch(error) {
        console.error(error);
      }
  }
  return (
    loggedIn || withoutRegistration ? (
      !profile ? (
    <div className={`h-screen m-2 relative flex justify-center items-center overflow-hidden transition-colors duration-700 px-4 ${!darkTheme ? "bg-gradient-to-br from-violet-700 to-indigo-900"
     : "bg-gradient-to-br from-gray-950 to-[#040014]"}`}>
      <div className='absolute top-5 right-4 inline-block' onMouseEnter={() => {
        setExit(true);
        setGoToProfile(true);
      }
      } onMouseLeave={() =>{
         setGoToProfile(true);
         setExit(false)}
      } >
        <button className='flex items-center justify-center rounded-xl shadow-lg active:slace-95 hover:scale-105 w-20 h-8 hover:shadow-2xl text-white/90  bg-purple-800 hover:bg-purple-950 border border-white/50 transition-all duration-500 cursor-pointer'>{UserLogin ? UserLogin : "Guest"}</button>
      <button className={`mt-2 px-5  flex items-center justify-center transition-all duration-500 active:scale-95 bg-white/20 hover:bg-white/30 border-white/40 shadow-lg w-15 h-10 ${exit ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"} rounded-full backdrop-blur-sm cursor-pointer`}  onClick={() => withoutRegistration ? setErrorMessage("You can't see saved users without account") : setProfile(true)}>👤</button>
      <button className={`mt-2 px-5 flex items-center justify-center transition-all duration-500  ${exit ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"} transition-all duration-200 active:scale-95 bg-white/30 hover:bg-white/40 border border-white/25 text-white/50 shadow-lg rounded-xl w-15 h-10 backdrop-blur-2xl cursor-pointer transform`} onClick={() => {
        setUserLogin(null);
        setUserPassword(null);
        setLoggedIn(false);
        setWithoutRegistration(true);
      }}>Exit</button> </div>
     {withoutRegistration ? 
     
  <div>
      <button className='absolute top-4 right-40 transition-all duration-300 active:scale-95 bg-violet-700 hover:bg-indigo-800
      shadow-xl rounded-xl border border-violet-700/50 cursor-pointer w-32 h-10 text-white/50' onClick={() => {
setWithoutRegistration(false);
setRegistartionForm(false);
setErrorMessage("");
      } }>Sign in</button>
<button className='absolute top-4 right-70 mx-5 transition-all duration-300 active:scale-95 bg-violet-700 hover:bg-indigo-800
cursor-pointer border border-violet-700/40 w-32 h-10 text-white/50 rounded-xl shadow-xl' onClick={() => {
  setWithoutRegistration(false);
  setRegistartionForm(true);
  setErrorMessage("");
}}>Sign up</button>
</div>
        :
          <div></div>
           }
     

      <button className={`w-40 h-12 rounded-lg flex items-center duration-300  justify-center active:scale-95 shadow-md hover:shadow-2xl hover:scale-105 cursor-pointer font-bold ${!darkTheme ? "bg-purple-600 hover:bg-purple-700  text-white/90}"
       : "bg-indigo-900 hover:bg-indigo-950 text-white/80"} absolute top-4 left-4`} 
      onClick={() => setDarkTheme(!darkTheme)}>{darkTheme ? "Light theme" : "Dark theme"}</button>
      <div className={`relative w-80 p-5 rounded-3xl flex flex-col space-y-3 backdrop-blur-2xl transition-all duration-300
            hover:translate-y-1 hover:scale[1.02] shadow-lg hover:shadow-xl ${!darkTheme ? "bg-purple-200/20 border-purple-400/30" : "bg-[#0f0b20] border-[#443366]/40"}`}>
        <button className={`w-40 h-12 0 rounded-xl shadow-lg cursor-pointer text-white 
        text-lg font-semibold transition-all duration-300 ${!darkTheme ? "bg-purple-700 hover:bg-purple-800 text-white/90 hover:shadow-2xl"
         : "bg-indigo-900 hover:bg-indigo-950 text-white/80 hover:shadow-2xl"} `} onClick={() => getRandomUser()}>Get random user</button>
        <h1 className='font-semibold text-center text-3xl  text-violet-200 drop-shadow-lg tracking-wide'>{name}</h1>
        <h2 className='font-semibold text-center text-violet-300 tracking-wide text-3xl'>{age}</h2>
        <h2 className='font-semibold text-center text-3xl text-violet-400 tracking-wide'>{gender}</h2>
        <h3 className={`text-center text-base font-mono tracking-wider drop-shadow-md ${!darkTheme ? "text-fuchsia-300" : "text-purple-800"}`}>{phoneNumber}</h3>
        <img src={image} className='w-full h-48 object-cover rounded-2xl shadow-md hover:shadow-xl border border-white/10 hover:scale-105 transition duration-300'></img>
        <h1 className={`text-center font-extrabold uppercase mb-3 tracking-wider text-sm ${!darkTheme ? "text-violet-300/30" : "text-white/20"} mt-2`}>{location}</h1>
        <h1 className='text-center font-bold drop-shadow-2xl text-violet-200/40 text-xl mt-4 p-3 rounded-xl bg-purple-900/20 border border-purple-500/10 leading-relaxed'>Credentials: <br/> 
        <span className='text-white/50 font-serif '>Username : {username}</span> <br/> 
        <span className='text-white/50 font-serif group'>Password: <span className='opacity-0 group-hover:opacity-100'>{password}</span> </span></h1>
        <button className='w-full py-2 bg-violet-800 hover:bg-violet-900 text-white/50 shadow-md rounded-xl cursor-pointer active:scale-95 mt-2' 
        onClick={() => SaveUser()}>Save</button>
        <p id = "error" className='font-extrabold text-xl text-red-400 text-center min-h-[2rem] drop-shadow-2xl mt-1'>{errorMessage}</p>
      </div>
      
    </div>
    
      ) : (
        UserLogin && <Profile UserLogin={UserLogin} darkTheme={darkTheme}/>
      )
  ) : registrationForm ? (
    <div className='h-screen flex justify-center items-center bg-gradient-to-br from-violet-900 via-violet-900 to-black p-4'>
      <div className='w-full max-w-md hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] relative p-[2px] bg-gradient-to-r from-emerald-400 to-amber-300 
      rounded-2xl shadow-2xl justify-center items-center'>
        <div className='rounded-3xl bg-black/30 backdrop-blur-xl p-6 shadow-inner flex flex-col space-y-4'>
        <h1 className='font-semibold text-white/80 text-3xl tracking-wider drop-shadow-2xl'>Create an account</h1>
        <input className = 'w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emearld-300 transition-all duration-300 shadow-inner'type="text" placeholder='username'onChange={(e) => setUserLogin(e.target.value)}/>
        <input className='w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emearld-300 transition-all duration-300 shadow-inner' type="password" placeholder='password' onChange={(e) => setUserPassword(e.target.value)} />
        <button type="button" className='w-full py-3 h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl
        rounded-xl cursor-pointer text-white font-semibold active:scale-95 transition-all duration-300' onClick={() => Register()}>Sign up</button>
        <button className='w-full mt-2 py-2 hover:bg-white/20 rounded-xl shadow-md text-white/70 hover:text-white cursor-pointer hover:scale-105
        bg-white/10 hover:shadow-lg transition-all duration-300' onClick={() => setRegistartionForm(false)}>Already have an account</button>
        <p className='font-extrabold text-2xl text-red-400 text-center min-h-[2rem] drop-shadow-2xl'>{errorMessage}</p>
        <button className='w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 border border-white/20
        cursor-pointer rounded-xl shadow-xl transition-all duration-300 text-white/60 hover:scale-105' onClick={() => {
          setErrorMessage("");
          setUserLogin(null);
          setUserPassword(null);
          setWithoutRegistration(true);}}>Continue without account</button>
      </div>
    </div>
    </div>
  ) : (
    <div className='h-screen flex justify-center items-center bg-gradient-to-br from-violet-900 via-violet-900 to-black p-4'>
      <div className='w-full max-w-md hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] relative p-[2px] bg-gradient-to-r from-emerald-400 to-amber-300 
      rounded-2xl shadow-2xl justify-center items-center'>
        <div className='rounded-3xl bg-black/30 backdrop-blur-xl p-6 shadow-inner flex flex-col space-y-4'>
        <h1 className='font-semibold text-white/80 text-3xl tracking-wider drop-shadow-2xl'>Log in</h1>
        <input className = 'w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emearld-300 transition-all duration-300 shadow-inner'type="email" placeholder='username'onChange={(e) => setUserLogin(e.target.value)}/>
        <input className='w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emearld-300 transition-all duration-300 shadow-inner' type="password" placeholder='password' onChange={(e) => setUserPassword(e.target.value)} />
        <button type="button" className='w-full py-3 h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl
        rounded-xl cursor-pointer text-white font-semibold active:scale-95 transition-all duration-300' onClick={() => LogIn()}>Log in</button>
        <button className='w-full mt-2 py-2 hover:bg-white/20 rounded-xl shadow-md text-white/70 hover:text-white cursor-pointer hover:scale-105
        bg-white/10 hover:shadow-lg transition-all duration-300' onClick={() => setRegistartionForm(true)}>Do not have an account</button>
        <p id = "error-message" className='font-extrabold text-2xl text-red-400 text-center min-h-[2rem] drop-shadow-2xl'>{errorMessage}</p>
      </div>      
      </div>
    </div>
  )
)

}
function App() {

  return (
 <RandomUser/>
    
  )
}

export default App
