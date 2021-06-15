// Postponed

// @route GET api/users/getfriendname
// @desc Get friend's name by ID
// @access Private
// router.get('/getfriendbyhandle/:handle', passport.authenticate('jwt', { session: false }), (req, res) => {
//     var errors = {};

//     User.findOne({ handle: req.params.handle })
//         .then(user => {
//             if (user) {
//                 var returnUser = {
//                     id: user._id,
//                     handle: user.handle,
//                     displayname: user.displayname
//                 }
//                 return res.json(returnUser);
//             }
//             else {
//                 errors.handle = "User not found with that handle"
//                 return res.status(404).json(errors);
//             }

//         })
//         .catch(err => {
//             errors.handle = "Error fetching user with that handle"
//             return res.status(404).json(errors);
//         })
// });

// @route GET api/users/getfriendname
// @desc Get friend's name by ID
// @access Private
// router.get('/getfriendname/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//     var errors = {};
//     // console.log("getfriendname ID: ", req.params.id);
//     // return;

//     User.findOne({ _id: ObjectId(req.params.id) })
//         .then(user => {
//             if (user) {
//                 var returnUser = {
//                     id: user._id,
//                     handle: user.handle,
//                     displayname: user.displayname
//                 }
//                 return res.json(returnUser);
//             } else {
//                 errors.getfriendname = "Friend ID not found";
//                 return res.status(404).json(errors);
//             }
//         })
//         .catch(err => {
//             errors.getfriendname = "Error fetching friend name";
//             errors.error = err;
//             return res.status(404).json(errors);
//         })
// });

// @route GET api/users/friends
// @desc Get current user's friend list
// @access Private
// router.get('/friends', passport.authenticate('jwt', { session: false }), (req, res) => {
//     User.findOne({ _id: req.user })
//         .then(user => {
//             if (user) {
//                 res.json(user.friends)
//             } else {
//                 res.status(404).json({ "Error": "User not found" });
//             }
//         })
//         .catch(err => res.status(400).json({ "Error fetching friend list": err }));
// });

// @route POST api/users/rejectfriendrequest/:id
// @desc Reject friend request by id
// @access Private
// router.post('/acceptfriendrequest/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//     const senderUserId = req.params.id;
//     console.log("accept userid: ", senderUserId);
//     var errors = {};
//     User.findOne({ _id: req.user })
//         .then(accepterUser => {
//             if (accepterUser) {
//                 User.findOne({ _id: senderUserId })
//                     .then(senderUser => {

//                         console.log("sender user found: ", senderUser._id);
//                         // console.log("accepter user found: ", accepterUser._id);

//                         /*
//                             accepterUser = the person who is accepting the friend request. Have to filter out the request from their request array.
//                             senderUser = the person who sent the friend request. Have to filter out the request from their sendrequests array.
//                         */

//                         if (senderUser) {
//                             try {

//                                 // requests = received requests
//                                 var requests = Object.assign([], accepterUser.requests);
//                                 // console.log("accepter user found: ",  requests.filter(elt => (elt.requestType === 'friend' && elt._id.toString() === senderUserId.toString())));
//                                 // return;

//                                 if (requests.filter(elt => (elt.requestType === 'friend' && elt._id.toString() === senderUserId.toString())).length > 0) {
//                                     // Remove recipientUser's ID from senderUser's sentrequests list
//                                     var sentRequests = Object.assign([], senderUser.sentrequests);
//                                     sentRequests.filter(elt => !(elt.requestType === 'friend' && elt._id.toString() === req.user._id.toString()))
//                                     senderUser.sentrequests = sentRequests;

//                                     // Remove senderUser's ID from recipientUser's requests list.
//                                     requests = requests
//                                         .filter(elt => !(elt.requestType === 'friend' && elt._id.toString() === senderUserId.toString()));
//                                     accepterUser.requests = requests;

//                                     // add senderUser's ID to recipientUser's friend list
//                                     var accepterUserFriends = Object.assign([], accepterUser.friends);
//                                     accepterUserFriends.push(senderUserId);
//                                     accepterUser.friends = accepterUserFriends;

//                                     // add recipientUser's ID to senderUser's friend list
//                                     var senderFriends = Object.assign([], senderUser.friends);
//                                     senderFriends.push(req.user._id);
//                                     senderUser.friends = senderFriends;

//                                     accepterUser.save()
//                                         .then(user => {
//                                             senderUser.save()
//                                                 .then(senderUser => res.json(requests))
//                                                 .catch(err => res.status(400).json({ "Server error accepting friend request": err }));
//                                         })
//                                         .catch(err => res.status(400).json({ "Server error accepting friend request": err }));

//                                 } else {
//                                     return res.status(400).json({ acceptfriendrequest: "Request not found" });
//                                 }

//                             }
//                             catch (err) {
//                                 console.log("acceptfriendrequest error: ", err);
//                             }
//                         } // senderUser found
//                         else {
//                             errors.acceptfriendrequest = "Recipient user not found";
//                             return res.status(404).json(errors);
//                         }

//                     })
//                     .catch(err => {
//                         errors.acceptfriendrequest = err;
//                         return res.status(404).json(errors);
//                     })

//             }  // Current user not found
//             else {
//                 // console.log("accept user was not found...");
//                 return res.status(404).json("Current user not found");
//             }
//         })
//         .catch(err => {
//             // console.log("accept user - some other error...");
//             res.status(500).json({ "Server error accepting friend request": err });
//         })

// });

// @route DELETE api/users/rejectfriendrequest/:id
// @desc Reject friend request by id
// @access Private
// router.delete('/rejectfriendrequest/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//     const userId = req.params.id;
//     var errors = {};
//     console.log("reject userid: ", userId);

//     User.findOne({ _id: req.user })
//         .then(user => {
//             if (user) {

//                 User.findOne({ _id: userId })
//                     .then(recipientUser => {
//                         if (recipientUser) {

//                             // Remove userId from user's requests
//                             // Remove req.user._id from recipientUser's sentrequests

//                             var requests = Object.assign([], user.requests);

//                             requests = requests.filter(elt => !(elt.requestType === 'friend' && elt._id.toString() === userId.toString()));
//                             user.requests = requests;

//                             var sentRequests = Object.assign([], recipientUser.sentrequests);
//                             sentRequests = sentRequests
//                                 .filter(elt => !(elt.requestType === 'friend' && elt._id.toString() === req.user._id.toString()));

//                             recipientUser.sentrequests = sentRequests;

//                             user.save()
//                                 .then(user => {
//                                     recipientUser.save()
//                                         .then(recipientUser => res.json(requests))
//                                         .catch(err => {
//                                             errors.rejectfriendrequest = "Server error: Unable to update recipientUser requests";
//                                             res.status(500).json(errors);
//                                         })

//                                 })
//                                 .catch(err => res.status(400).json({ "Server error rejecting friend request": err }));

//                         } // recipientUser found
//                         else {
//                             errors.rejectfriendrequest = "Recipient user not found";
//                             return res.status(404).json(errors);
//                         }

//                     })
//                     .catch(err => {
//                         errors.rejectfriendrequest = "Error finding recipientUser";
//                         return res.status(404).json(errors);
//                     })
//             } else {
//                 // console.log("reject user was not found...");
//                 return res.status(404).json("Current user not found");
//             }
//         })
//         .catch(err => {
//             console.log("reject user - some other error...");
//             res.status(500).json({ "Server error rejecting friend request": err });
//         })

// });

// THIS SHOULD BE A GET, FIX BY USING PARAMETER INSTEAD OF REQ.BODY
// @route POST api/users/getfriendrequests
// @desc Get username by id
// @access Private
// router.post('/getfriendrequests', passport.authenticate('jwt', { session: false }), (req, res) => {

//     const { requesterId } = req.body;
//     const currentUser = req.user; // ObjectId

//     // return res.json(currentUser);

//     // console.log("request Id: ", requesterId);

//     User.findOne({ _id: ObjectId(requesterId) })
//         .then(user => {
//             if (user) {
//                 var returnUser = {
//                     _id: user._id,
//                     displayname: user.displayname,
//                     date: currentUser.requests.filter(elt => elt._id.toString() === requesterId.toString() && elt.requestType === 'friend')[0].date
//                 }
//                 return res.json(returnUser);
//             } else {
//                 return res.status(404).json("User not found");
//             }

//         })
//         .catch(err => res.json(err));

// });

// @route GET api/users/updaterequests
// @desc Get/update requests list
// @access Private
// router.get('/getsentrequests', passport.authenticate('jwt', { session: false }), (req, res) => {

//     // return res.json(req.user);
//     User.findOne({ _id: req.user })
//         .then(user => {
//             if (user) {
//                 res.json(user.sentrequests);
//             } else {
//                 res.status(404).json("User not found");
//             }
//         })
//         .catch(err => res.json(err));

// });

// @route GET api/users/updaterequests
// @desc Get/update requests list
// @access Private
// router.get('/getrequests', passport.authenticate('jwt', { session: false }), (req, res) => {
//     // return res.json(req.user);

//     try {
//         User.findOne({ _id: req.user })
//             .then(user => {
//                 if (user) {
//                     res.json(user.requests);
//                 } else {
//                     res.status(404).json("User not found");
//                 }
//             })
//             .catch(err => res.json(err));
//     }
//     catch (err) {
//         console.log("getrequests error: ", err);
//     }
// });

// @route POST api/users/sendfriendrequest
// @desc Create & send a friend request
// @access Private
// router.post('/sendfriendrequest', passport.authenticate('jwt', { session: false }), (req, res) => {

//     console.log("sending friend request");
//     const errors = {};
//     const { recipientId } = req.body;
//     const senderId = req.user._id;

//     User.findOne({ _id: ObjectId(recipientId) })
//         .then(recipientUser => {

//             if (recipientUser) {
//                 User.findOne({ _id: ObjectId(senderId) })
//                     .then(senderUser => {

//                         if (senderUser) {
//                             // return res.json(senderUser);

//                             // recipientUser.requests = [];
//                             // recipientUser.save()
//                             //     .then(recipientUser => {
//                             //         res.json(recipientUser)
//                             //     })
//                             //     .catch(err => {
//                             //         res.json({ "Error": "Error sending friend request." })
//                             //     });
//                             // return;

//                             try {

//                                 var recipientFriendRequests = recipientUser.requests;
//                                 recipientFriendRequests = recipientFriendRequests.map(elt => elt._id.toString());

//                                 var senderFriendRequests = senderUser.requests;
//                                 senderFriendRequests = senderFriendRequests.map(elt => elt._id.toString());

//                                 var recipientFriends = recipientUser.friends;
//                                 recipientFriends = recipientFriends.filter(elt => elt._id.toString() === senderId.toString());
//                                 var senderFriends = senderUser.friends;
//                                 senderFriends = senderFriends.filter(elt => elt._id.toString() === recipientId.toString());

//                                 if (recipientFriends.length > 0 || senderFriends.length > 0) {
//                                     return res.status(400).json({ friendrequest: "You are already friends with that user" });
//                                 }

//                                 if (!recipientFriendRequests.includes(senderId.toString()) &&
//                                     !senderFriendRequests.includes(recipientId.toString())) {
//                                     var newRequest = {
//                                         _id: senderId,
//                                         requestType: 'friend'
//                                     }

//                                     var newRequestForMe = {
//                                         _id: recipientId,
//                                         requestType: 'friend'
//                                     }

//                                     recipientUser.requests.push(newRequest);
//                                     recipientUser.save()
//                                         .then(recipientUser => {
//                                             senderUser.sentrequests.push(newRequestForMe);
//                                             senderUser.save()
//                                                 .then(senderUser => {
//                                                     return res.json(senderUser.sentrequests);
//                                                 })
//                                                 .catch(err => {
//                                                     errors.friendrequest = "Failed sending friend request";
//                                                     return res.status(500).json(errors);
//                                                 });
//                                         })
//                                         .catch(err => {
//                                             errors.friendrequest = "Failed sending friend request";
//                                             return res.status(500).json(errors);
//                                         });
//                                 } else {
//                                     errors.friendrequest = "A friend request already exists between you and this user";
//                                     return res.json(errors);
//                                     // errors.friendrequest = "Friend request already sent";
//                                     // return res.status(400).json(errors);
//                                 }

//                             }
//                             catch (err) {
//                                 return console.log("friend request error: ", err);
//                             }

//                         }  // senderUser found
//                         else {
//                             return res.status(404).json({ friendrequest: "Sender user not found" });
//                         }

//                     })
//                     .catch(err => {
//                         errors.friendrequest = err;
//                         return res.status(404).json(errors);
//                     })
//             } // recipientUser found
//             else {
//                 return res.status(404).json({ friendrequest: "Recipient user not found" });
//             }
//         })
//         .catch(err => {
//             errors.friendrequest = err;
//             return res.status(404).json(errors);
//         })

//     // User.findOneAndUpdate(
//     //     { _id: username },
//     //     { $set: profileFields },
//     //     { new: true }
//     // )
//     //     .then(user => {
//     //         res.json(user);
//     //     })
//     //     .catch(err => res.json(err));
// });

// @route DELETE api/profiles
// @desc Delete user AND profile
// @access Private
// router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
//     User.deleteOne({ _id: req.user._id })
//         .then(() => res.json({ msg: "User successfully deleted" }))
//         .catch(err => res.status(500).json("Error deleting profile/user: ", err));
// })
