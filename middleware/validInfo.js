module.exports = function (req, res, next) {
    const { email, name, password,
        project_name, project_description, // create project
        user_email, project_id, // invitation and fetching members
        invitation_id // invitation accept or reject
    } = req.body;

    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (req.path === "/register") {

        if (![email, name, password].every(Boolean)) {
            return res.status(400).json("Missing Credentials");
        }
        else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }
    else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.status(400).json("Missing Credentials");
        }
        else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }
    else if (req.path == "/createProject") {
        if (![project_name, project_description].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path == "/invite") {
        if (![user_email, project_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
        else if (!validEmail(user_email)) {
            return res.status(400).json("Invalid Email");
        }
    }
    else if (req.path == "/acceptInvite" || req.path == "/rejectInvite") {
        if (![invitation_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path == "/fetchMembers" || req.path == "/owner") {
        if (![project_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }

    next();
};