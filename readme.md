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

## famousPost

**get**: get the list of all post
_input_: authorization optional

_output_: 

```
{
    "postId": "id of the post",
    "date": "timestamp when the post was created",
    "description" :"description of the post",
    "mediaUrl": "url of the media if there in the post",
    "mediaThumbUrl": "thumbnail url of the media if there in the post",
    "mimeType: "mime type of the media",
    "creatorId": "id of the user who posted the post",
    "isLiked": "1 or 0 if user liked the post or not",
    "userName": "name of the user who posted the post",
    "userDp" : "dp of the user who posted the post",
    "profileId": "profile id of the user who posted the post"
}
```

**post**: add or uplaod the post

_input_: authorization required

```
{
    "desc": "description of the post",
    "mediaUrl": "media url of the media added in post",
    "mediaThumbUrl": "thumbnail url of the media in post",
    "postId": "id of the post",
    "mimeType": "mime type of the media in post"
}
```

_output_: 

_failed status code_: 400 if input wrong and 500 if something went wrong.

_success_: 200 status code

```
{
    "message": "success message"
}
```

## sendRequest

**get**: get the video request that user sent to other peoples

_input_: authorization required

_output_: 

_failed status code_: 400 if input wrong and 500 if something went wrong.

_success_: 200 status code

```
{
    "id": "unique id of the request",
    "requestorId": "id of the person who sent the request",
    "inviteeId" : "id of the user who received the request",
    "roomName" : "room name of the video call",
    "status": "status of the request 0 means sent 2 means rejected",
    "updatedAt": "latest time when the request updated"
}
```

**post**: send the video call request or update the video call request

_input_ : authorization required

```
{
    "status":" 0 sent the request, 1 accept the request, 2 cancel the request",
    "inviteeId":"id of the user to who receive the invit",
    "callTime":"time of the video call"
}
```

_output_: 

_failed status code_: 400 if input wrong and 500 if something went wrong.

_success_: 200 status code

```
{
    "message": "success message"
}
```

**delete**: delete the sent video call request

_input_: authorization required

```
{
    "id": "id of the request to delete"
}
```
_output_: 

_failed status code_: 400 if input wrong and 500 if something went wrong.

_success_: 200 status code

```
{
    "message": "success message"
}
```

## receivedRequest

**get**: get the received request from the other users.

_input_: authorization required

_output_: 

_failed status code_: 400 if input wrong and 500 if something went wrong.

_success_: 200 status code

```
{
    "id": "unique id of the request",
    "requestorId": "id of the person who sent the request",
    "inviteeId" : "id of the user who received the request",
    "roomName" : "room name of the video call",
    "status": "status of the request 0 means sent 2 means rejected",
    "updatedAt": "latest time when the request updated"
}
```

## folder structure

_create new folder if any new API need which si not part of current folder like if not part of profile, videorequest send, videorequest receive, post etc_

_each folder should have **route** which contains get, post etc http method, method folder for different http method input check and make function call and functions call which contains logic like database call for http method_

## coding pattern

_use router.use('', validateFirebaseIdToken()) to enforce the authorization for the other methods. So all route after that require authorization.