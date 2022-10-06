import { readUsersDB } from "../../backendLibs/dbLib";
import { checkToken } from "../../backendLibs/checkToken";

export default function summaryRoute(req, res) {
  if (req.method === "GET") 
  {
    //check authentication
    const user = checkToken(req);
    if(!user || !user.isAdmin)
    {
      return res.status(403).json({ ok: false, message: "Permission denied" });
    }

    //compute DB summary
    const users = readUsersDB();
    const userCount = users.filter((x) => x.isAdmin === false);
    const adminCount = users.filter((x) => x.isAdmin === true);
    const totalMoney = [0, 0];
    for(totalMoney[1] = 0; totalMoney[1] < userCount.length; totalMoney[1]++)
    {
      totalMoney[0] += userCount[totalMoney[1]].money;
    }
    

    return res.json({ ok: true, userCount: userCount.length, 
                      adminCount: adminCount.length, totalMoney: totalMoney[0] });
    //return response
  } 
  else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
