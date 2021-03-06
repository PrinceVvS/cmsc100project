import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';
import CSS from './styling.css';

//const mongoose = require('mongoose')
//const User = mongoose.model('User')

export default class Profile extends Component {

  constructor(props) {
    super(props)

    this.state = {
		username: localStorage.getItem('username'),
		email: null,
		about: null,
		birthday: null,
		isLoggedIn: false,
		checkedIfLoggedIn: false,
		postArray: []
    }
	
	const username = {
		username: localStorage.getItem('username')
	}
	fetch('http://localhost:3001/getInfo', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(username)
	})
		.then(response => response.json())
		.then(body => {
			console.log(body.email)
			this.setState({email: body.email, about: body.about, birthday: body.birthday})
		})
		
	fetch('http://localhost:3001/doPostArray', {
			method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(username)
	})
		.then(response => response.json())
		.then(body => {
			this.setState({postArray: body.postArray})
		})
		
    fetch('http://localhost:3001/checkIfLoggedIn', {
      method: 'POST',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(body => {
        console.log(body)
        if (body.isLoggedIn) {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: true })
        }
        else {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: false })
        }
      })

    this.logout = this.logout.bind(this)
	this.edit = this.edit.bind(this)
	this.dpa = this.dpa.bind(this)
	this.deletePost = this.deletePost.bind(this)
  }

	profile(e) {
		e.preventDefault()
		
		window.location.replace('http://localhost:3000/profile')
		
	}
	
	dashboard(e) {
		e.preventDefault()
		
		window.location.replace('http://localhost:3000/dashboard')
		
	}
	
	dpa(e) {
		e.preventDefault()
		
		const username = {
			username: localStorage.getItem('username')
		}
		
	}
	
	edit(e) {
		e.preventDefault()
		
		const currdata = {
			username: localStorage.getItem('username'),
			name: document.getElementById('e-name').value,
			email: document.getElementById('e-email').value,
			password: document.getElementById('e-password').value,
			about: document.getElementById('e-about').value,
			birthday: document.getElementById('e-birthday').value
		}
		
		console.log(currdata)
		
		fetch ('http://localhost:3001/editprofile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(currdata)
		})
			.then(response => response.json())
			.then(body => {
				if(!body.sucess){
					localStorage.setItem('username', body.username)
					alert('sucessfully edited profile')
				}else{
					alert('failed to edit profile')
				}
			})
	}
	
	editPost(e){
		e.preventDefault()
		
		const currdata = {
			author: localStorage.getItem('username'),
			content: document.getElementById('e-content').value
		}
		
		console.log(currdata)
		
		fetch ('http://localhost:3001/editPost', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(currdata)
		})
			.then(response => response.json())
			.then(body => {
				if(!body.sucess){
					alert('sucessfully edited post')
				}else{
					alert('failed to edit post')
				}
			})
	}
	
	deletePost(e){
		e.preventDefault()
		
		const currdata = {
			author: localStorage.getItem('username'),
			id: document.getElementById('deletePost').value
		}
		
		console.log(currdata)
		
		fetch ('http://localhost:3001/deletePost', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(currdata)
		})
			.then(response => response.json())
			.then(body => {
				if(!body.sucess){
					alert('sucessfully deleted post')
				}else{
					alert('failed to deleted post')
				}
			})
	}
	
	addPost(e) {
    e.preventDefault()

	var currdate = new Date()
	currdate = currdate.getFullYear()+'-'+(currdate.getMonth()+1)+'-'+currdate.getDate()+' '+currdate.getHours() + ":" + currdate.getMinutes() + ":" + currdate.getSeconds()

	console.log(currdate)

    const newPost = {
		username: localStorage.getItem('username'),
		content: document.getElementById('a-content').value,
		date: currdate
    }


    fetch('http://localhost:3001/addPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          alert('Successfully posted!')
        } else {
          alert('Failed to post')
        }
      })

  }


  logout(e) {
    e.preventDefault()

    const cookies = new Cookies()
    cookies.remove('authToken')

    localStorage.removeItem('username')

    this.setState({ isLoggedIn: false })
  }

  render() {	  
	const postArray = this.state.postArray
    if (!this.state.checkedIfLoggedIn) {
      return (<div></div>)
    }

    else {

      if (this.state.isLoggedIn) {
        return (
			<div>
				<nav class="navbar">
					<a id="face">
						<h2>face</h2>
					</a>
					
					<ul>
						<li><button id='logout' onClick={this.logout}>Log Out</button></li>
						<li><button id='dashboard' onClick={this.dashboard}>Dashboard</button></li>
						<li><button id='profile' onClick={this.profile}>Profile</button></li>
					</ul>
				</nav>
				
				<div id='profiledetails'>
					<h2>{this.state.username}</h2><br/>
					Email: {this.state.email} <br/>
					About: {this.state.about} <br/>
					Birthday: {this.state.birthday}	
				</div>
				
				<div id='editprofile'> 
					<h4>Edit Profile</h4>
					<input type="text" id="e-name" placeholder="Name" /> <br/>
					<input type="text" id="e-email" placeholder="Email" /> <br/>
					<input type="password" id="e-password" placeholder="Password" /> <br/>
					<input type="text" id="e-about" placeholder="About" /> <br/>
					<input type="text" id="e-birthday" placeholder="Birthday" /> <br/>
					<button id='editbutton' onClick={this.edit}>Edit</button>
				</div>
				
				<div class='postfeed'>
					<h3>Feed</h3>
					<div id='addpost'>
						<input type="text" id="a-content" placeholder="Write something here" />
						<button id='addpost' onClick={this.addPost}>Post</button>
					</div>
					{[...this.state.postArray].map((post, index) => {
						return(
							<div class='post'>
								<h5>{post.author}</h5>
								{post.content}<br/>
								{post.timestamp}<br/><br/>
								<input type="text" id="e-content" placeholder="Edit Content" /> <br/>
								<button id='editContent' onClick={this.editPost}>Edit</button>
								<button id='deletePost' value={post._id} onClick={this.deletePost}>Delete Post</button>
							</div>
						)
					})}
				</div>
			</div>
        )  
      }
      else {
        return <Redirect to="/" />
      }

    }

    
    
  }
}