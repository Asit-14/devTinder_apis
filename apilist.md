# DevTinder  API's

# authRouter
POST/signup
POST/login
POST/logout

# profileRouter
PATCH/profile/view
GET/profile/edit
PATCH/profile/password// forgot password api


#  connectionRequestRouter
POST/request/send/interest/:userId
POST/request/send/ignore/:userId
POST/request/review/accepted/:requestId
POST/request/review/rejected/:requestId


# userRouter
GET/ connection
GET/ request/ recivied
GET / feed - gets  you the profile of other  user  on the platfrom



Status : ignore, interested ,  accepeted, rejected 