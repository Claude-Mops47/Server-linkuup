
const generateVersion = (appointments)=>{
    let version = 0;
    for (const appointment of appointments){
        version += appointment.version ||0;
    }
    return version.toString()
}