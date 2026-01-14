

function signupValidation(full_name, email, password,confirm_password){
    // Check parameters arenot null
    if (!full_name || !email || !password || !confirm_password) {
        return "Missing required fields";
    }
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }

  // Check password match with confirm
    if (password !== confirm_password) {
        return "Passwords do not match";
    }

    return null; // no errors
}

function loginValidation(email, password){
    // Check parameters arenot null
    if (!email || !password ) {
        return "Missing required fields";
    }
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }

  
    return null; // no errors
}



export{signupValidation, loginValidation}