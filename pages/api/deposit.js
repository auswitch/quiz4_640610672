import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";


export default function depositRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    if(!user || user.isAdmin)
    {
      return res.status(403).json({ ok: false, message: "You do not have permission to deposit" });
    }

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    if(amount < 1)
      return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });

    const users = readUsersDB();
    const foundUser = users.find(
      (x) => x.username === user.username);
    foundUser.money += amount;

    //find and update money in DB
    writeUsersDB(users);
    return res.json({ ok: true, money: foundUser.money });

    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
