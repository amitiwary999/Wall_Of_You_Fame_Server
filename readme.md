# Baseurl: https://fwalls-dot-expinf.appspot.com/

## profile

**get**: fetch the user profile using the userId or profileId

*Input*: Authentication optional.
```
{
    "profileId": "profile id of the user"(optional parameter. if authentication is not provided then it is required)
}
```

*output*: 
```
{
    "userId": "user id of the user",
    "profileId": "profile id of the user",
    "userName": "user name of the user",
    "userBio": "bio of the user",
    "userEmail": "email of the user",
    "userDp": "profile dp of the user",
}
```

**post**: add user profile

*Input*: Authentication required
```
{
    "name": "name of the user",
    "dp": "profile dp of the user",
    "email": "email id of the user",
    "profileId": "profile id of the user(this is unique for each user and use in profile like baseurl/profile/profileId to see the user profile)",
}
```
*Output*: 
_failed status code_: 400 if input wrong and 500 if something went wrong.
_success_: 200 status code

**patch**: update the user profile

*Input*: Authentication required
```
{
    "name": "if updated the updated name else old name",
    "dp": "if updated then updated dp else old dp",
    "bio": "if bio updated then updated bio else old bio"
}
```

*output*:
_failed status code_: 400 if input wrong and 500 if something went wrong.
_success_: 200 status code