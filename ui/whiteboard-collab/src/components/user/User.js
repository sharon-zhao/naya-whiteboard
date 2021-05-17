import React, { useState, useEffect } from 'react';
import axios from 'axios';

function User() {
  const [userName, setUserName] = useState({
    name:'',
    color:''
  })
  const [userList, setUserList] = useState([])
  const [newUser, setNewUser] = useState('')
  useEffect(()=>{
    axios.get("http://localhost:5000/read")
    .then(response =>{
      setUserList(response.data)
    })
  },[])

  const addToList = () => {
     axios.post("http://localhost:5000/adduser", {userName: userName})
     .then(res => {
       console.log(res)
     })
  }

  const updateUser = (id) => {
    axios.patch("http://localhost:5000/updateuser", {id: id, newUser: newUser})
  }
  const deleteUser = (id) => {
    axios.delete(`http://localhost:5000/delete/${id}`)
  }

  return (
    <div>
      <label>
        Person Name:
      </label>
      <input type="text" name="name" onChange={(event) => {
        setUserName(event.target.value)}} />
      <button type="submit" onClick={addToList}>Add</button>
      <h1>result</h1>
      {userList.map((val,key)=>{
        return (
          <div key={key}>
            <p>{val.name}</p>
            <input type='text' placeholder='update name' onChange={(event) => {
              setNewUser(event.target.value)}}/>
            <button onClick={() => updateUser(val._id)}>update</button>
            <button onClick={() => deleteUser(val._id)}>delete</button>
          </div>)
      })}
    </div>
  )
}

export default User
