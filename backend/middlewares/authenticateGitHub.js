const {Octokit} = require("@octokit/rest");
//ashish-choudhari-git Code
const authenticateGitHub = (req,res,next)=>{
    const {username,token} = req.body;

    if(!username || !token) {
        return res.status(400).json({ message : 'Username and token are required'});
    }

    req.octokit = new Octokit({auth:token});
    req.githubUsername = username;
    next();
}

module.exports = authenticateGitHub;