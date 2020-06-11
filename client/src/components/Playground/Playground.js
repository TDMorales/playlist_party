import React, { useState, useEffect } from 'react'
import { Button, Search, Segment } from 'semantic-ui-react'
import './Playground.css'

const Spotify = require('spotify-web-api-js')
const s = new Spotify()


export default function Playground(){
    const [user, setUser] = useState('')
    const [search, setSearch] = useState('')
    
    useEffect(()=>{
        fetch('http://localhost:5010/', { credentials: 'include'})
        .then(res=>res.json())
        .then(data=>{setUser(data)})
    }, []) 

    function getDevices(){
        console.log(user)
        console.log(user.access)
        s.setAccessToken(`${user.access}`)
        s.getMyDevices().then(
            function(data){
                console.log(data)
            }
        )
    }

    function getArtist(){
        s.setAccessToken(`${user.access}`)
        s.getArtist('2hazSY4Ef3aB9ATXW7F5w3').then(
            function (data) {
              console.log('Artist information', data);
            },
            function (err) {
              console.error(err);
            }
          );
    }

    var songQuery = null 
    async function searchSongs(){
        s.setAccessToken(`${user.access}`)
        if (songQuery !== null){
            songQuery.abort()
        }
        songQuery = await s.search(search, ["track"], {"limit":10} )
        var tracks = songQuery.tracks.items
        console.log(tracks) 
    }


    return(
        <body className='body'>
        <div>
            <Segment inverted>
                    <h1> Welcome, {user.username} </h1>
                <div>

                    <h1 onClick={getArtist}>sample</h1>
                </div>
                <div>
                    <Search onSearchChange={(e)=>(searchSongs(setSearch(e.target.value)))}></Search>
                    <Button inverted color='green' className="ui button" onClick={getDevices}>Find Devices</Button>
                </div>
            </Segment>
        </div>
        </body>
    )
}
