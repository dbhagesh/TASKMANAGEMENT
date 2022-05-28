module.exports = function (req, res, next) {
    const { email, name, password,
        project_name, project_description, // create project
        user_email, project_id, // invitation and fetching members
        invitation_id, // invitation accept or reject
        task_id, task_name, task_priority, task_type, task_description, // task creation and modification
        user_id // allocation of task
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
    else if (req.path == "/createTask") {
        if (![task_name, task_description, project_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path == "/modifyTask") {
        if (![task_id, task_name, task_description, project_id, task_priority, task_type,].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path == "/allocate") {
        if (![task_id, project_id, user_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }

    next();
};