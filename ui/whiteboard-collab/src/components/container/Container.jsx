import React, { useState, useEffect } from 'react';
import Board from '../board/Board';
import User from '../user/User'
import './style.css';
import axios from 'axios';
// import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function Container () {
  const [user, setUser] = useState('')
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(5)
  const [userList, setUserList] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  useEffect(()=>{
    axios.get("http://localhost:5000/read")
    .then(response =>{
      setUserList(response.data)
    })

  },[user])

  const addToList = () => {
     axios.post("http://localhost:5000/adduser", {name: user, color:color})
     .then(res => {
       setUser(res)
     })
  }
  console.log(userList)
  const addUrl = () =>{
    axios.post("http://localhost:5000/addurl", {imageUrl: imageUrl})
    .then(res => {
      console.log(userList)
      userList.map((k,v)=>{
        axios.patch("http://localhost:5000/updateuser", { id:k._id, images: res.data._id})
      })
    })
  }
  const addUser = ()=>{
    axios.get("http://localhost:5000/images")
    .then(res => {
      const imageid = res.data[res.data.length - 1]._id
      console.log(imageid)
      userList.map((k,v)=>{
        axios.patch("http://localhost:5000/updateimage", { id:k._id, imageID:imageid})
      })
    })
  }

  if (userList) {
  return (
    <div className='container'>
      <div className='tools-section'>
      <div className='color-picker-container'>
        <label>
          Person Name : &nbsp;
        </label>
        <input type="text" name="name" style={{ marginRight: '12px' }} onChange={(event) => {
          setUser(event.target.value)}} />
        Select Brush Color : &nbsp;
        <input type='color' onChange={(event) => {
          setColor(event.target.value)}}/>
        <button id='butt0' style={{ marginLeft: '12px' }} type="submit" onClick={addToList}>Add</button>
        </div>
        <div className='brushsize-container'>
          Select Brush Size : &nbsp;
          <select onChange={(event) => {
            setSize(event.target.value)}}>
            <option> 5 </option>
            <option> 10 </option>
            <option> 15 </option>
            <option> 20 </option>
            <option> 25 </option>
            <option> 30 </option>
          </select>
        </div>
      </div>
      <div className='people'>
      {userList.map((val,key)=>{
        return (
          <div id='namecolor' key={key}>
            <p id='text'>User Name: {val.name} </p>
            <div style={{backgroundColor: val.color, width:'20px', height:'15px', marginLeft:'10px'}} className="rectangle" />
            {/* <input type='text' placeholder='update name' onChange={(event) => {
              setNewUser(event.target.value)}}/>
            <button onClick={() => updateUser(val._id)}>update</button>
            <button onClick={() => deleteUser(val._id)}>delete</button> */}
          </div>)
      })}
      <button id='butt1' type="submit" onClick={addUrl}>Save image</button>
      <button id='butt2' type="submit" style={{color: 'white'}} onClick={addUser}>Close</button>
      </div>
        <div className='board-container'>
          <Board color={color} size={size} setImageUrl={setImageUrl}></Board>
        </div>
    </div>
  )}
}

export default Container
