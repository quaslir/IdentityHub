import { useEffect, useState } from "react";

export default function Profile({UserLogin, darkTheme}) {
    const [Response, setResponse] = useState([]);
    const [toggle, setToggle] = useState(0);
    console.log(darkTheme);
    useEffect(() => {
    async function LoadSavedUsers() {
        try {
            const res = await fetch("http://localhost:3000/load-saved-users", {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({UserLogin}),

            });
            if(!res.ok) {
                throw new Error("Error getting data from server");
            }
            const data = await res.json();
            setResponse(data.savedUsers);
        } catch(error) {
            console.error(error);
        }
    }
    LoadSavedUsers();
}, [UserLogin, toggle]);
async function deleteSavedUser(deleteUser) {
    console.log(deleteUser);
    try {
        const res = await fetch("http://localhost:3000/delete-saved-user", {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({UserLogin, deleteUser})
        });
        const data = await res.json();
        console.log(data);
        setToggle(prev => prev + 1);
    } catch(error) {
        console.error(error);
    }
}
    return (
        <>
         <div  className="bg-gradient-to-br from-[#1a0b2e] via-[#12061f] to-[#090015] flex justify-center py-10 min-h-screen px-4">
            <h1 className="text-white/30 text-center drop-shadow-2xl text-5xl mb-4 tracking-wide">Saved users</h1>
                <div className="bg-white/10 
                backdrop-blur-xl p-6 rounded-3xl shadow-2xl shadow-purple-500/10 transition-all duration-300 border border-white/20 
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            
        {Response?.map((user) => (
       
            <div key={user.username} className={`relative w-80 p-5 rounded-3xl flex flex-col space-y-3 backdrop-blur-2xl transition-all duration-300
            hover:translate-y-1 hover:scale[1.01] shadow-lg hover:shadow-xl ${!darkTheme ? "bg-purple-100/10 border-purple-200/20" : "bg-[#0f0b16] border-[#332f4d]/40"}`}>

        <h1 className='font-semibold text-center text-3xl  text-violet-200 drop-shadow-lg tracking-wide'>{user.name}</h1>
        <h2 className='font-semibold text-center text-violet-300 tracking-wide text-3xl'>{user.age}</h2>
        <h2 className='font-semibold text-center text-3xl text-violet-400 tracking-wide'>{user.gender}</h2>
        <h3 className={`text-center text-base font-mono tracking-wider drop-shadow-md ${!darkTheme ? "text-fuchsia-300" : "text-purple-800"}`}>{user.phoneNumber}</h3>
        <img src={user.image} className='w-full h-48 object-cover rounded-2xl shadow-md hover:shadow-xl border border-white/10 hover:scale-105 transition duration-300'></img>
        <h1 className={`text-center font-extrabold uppercase mb-3 tracking-wider text-sm ${!darkTheme ? "text-violet-300/30" : "text-white/20"} mt-2`}>{user.location}</h1>
        <h1 className='text-center font-bold drop-shadow-2xl text-violet-200/40 text-xl mt-4 p-3 rounded-xl bg-purple-900/20 border border-purple-500/10 leading-relaxed'>Credentials: <br/> 
        <span className='text-white/50 font-serif'>Username : {user.username}</span> <br/> 
        <span className='text-white/50 font-serif group transition-opacity duration-500'>Password: <span className='opacity-0 group-hover:opacity-100'>{user.password}</span> </span></h1>
        <button className="bg-fuchsia-950 hover:bg-red-950 hover:scale-105 transition-all duration-300 active:scale-95
        w-full rounded-xl shadow-xl h-12 cursor-pointer text-fuchsia-300" onClick={() => {
            deleteSavedUser(user.name);
        }}>Delete</button>
        </div>  

        ))}
        </div></div>
        </>
    );
}