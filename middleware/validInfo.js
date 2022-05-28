const { enabled } = require("express/lib/application");

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
    console.log(req.path)
    if (req.path === "/register/" || req.path === "/register") {
        if (![email, name, password].every(Boolean)) {
            return res.status(400).json("Missing Credentials");
        }
        else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }
    else if (req.path === "/login/" || req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.status(400).json("Missing Credentials");
        }
        else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }
    else if (req.path === "/createProject" || req.path === "/createProject/") {
        if (![project_name, project_description].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path === "/invite" || req.path === "/invite/") {
        if (![user_email, project_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
        else if (!validEmail(user_email)) {
            return res.status(400).json("Invalid Email");
        }
    }
    else if (req.path === "/acceptInvite" || req.path === "/rejectInvite" || req.path === "/acceptInvite/" || req.path === "/rejectInvite/") {
        if (![invitation_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path === "/fetchMembers" || req.path === "/owner" || req.path === "/fetchMembers/" || req.path === "/owner/") {
        if (![project_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path === "/createTask" || req.path === "/createTask/") {
        if (![task_name, task_description, project_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path === "/modifyTask" || req.path === "/modifyTask/") {
        if (![task_id, task_name, task_description, project_id, task_priority, task_type,].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path === "/allocate" || req.path === "/allocate/") {
        if (![task_id, project_id, user_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path === "/fetchTasks" || req.path === "/fetchTasks/") {
        if (![project_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path === "/fetchOwnTasks" || req.path === "/fetchOwnTasks/") {
        if (![project_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path === "/fetchTaskUsers" || req.path === "/fetchTaskUsers/") {
        if (![task_id, project_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }
    else if (req.path === "/userDetails" || req.path === "/userDetails/") {
        if (![user_id].every(Boolean)) {
            return res.status(400).json("Missing Parameters");
        }
    }

    next();
};