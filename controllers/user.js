import { accounts } from "../constants/accounts.js";

export class UserController {
  static async getUser(req, res) {
    // Check if the user is Authenticated


    const userId = req.params.id;

    const user = accounts.find((account) => account.id === parseInt(userId));

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ ...user })
  }

  static async updateUser(req, res) {
    // check if the user is Authenticated
  }
}
