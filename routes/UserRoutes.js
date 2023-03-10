const express = require("express");
const authJwt = require("../middlewares/authJwt");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  getNearbyFriends,
} = require("../services/UserService.js");

const router = express.Router();

//only allows admin to retrieve all users
router.get("/", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
  try {
    let users = await getAllUsers();
    res.json({ status: "sucess", data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//user can view him/her own details only
router.get("/:id", [authJwt.verifyToken], async (req, res) => {
  try {
    let user = await getUserById(req.params.id);
    res.json({ status: "sucess", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//user can delete him/her own details only
router.delete("/:id", [authJwt.verifyToken], async (req, res) => {
  try {
    let user = await deleteUser(req.params.id);
    res.json({ status: "sucess", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//user can update him/her own details only
router.put("/:id", [authJwt.verifyToken], async (req, res) => {
  try {
    let user = await updateUser(req.params.id, req.body);
    res.json({ status: "sucess", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// user to follow another user
router.put("/follow/:followId", [authJwt.verifyToken], async (req, res) => {
  try {
    //req.userId is from header
    let user = await followUser(req.userId, req.params.followId);
    res.status(200).json({ data: user, message: "Followed user!" });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error following user" });
    }
  }
});

//for user to unfollow another user
router.put("/unfollow/:followId", [authJwt.verifyToken], async (req, res) => {
  try {
    //req.userId is from header
    let user = await unfollowUser(req.userId, req.params.followId);
    res.status(200).json({ data: user, message: "Unfollowed user!" });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error unfollowing user" });
    }
  }
});

router.get("/user/friends", [authJwt.verifyToken], async (req, res) => {
  try {
    //req.userId is from header
    let users = await getNearbyFriends(req.userId);
    res.status(200).json({ data: users, message: "success!" });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error retreiving friends" });
    }
  }
});

module.exports = router;
