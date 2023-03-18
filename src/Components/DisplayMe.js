import {useEffect, useState} from 'react'
export default function DisplayMe({ accessToken, spotifyApi }){
    const [userDetails, setUserDetails] = useState({})

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
        spotifyApi.getMe().then(res=>{
            const {display_name, email, country, images} = res.body
            setUserDetails({name:display_name, email:email, country:country, image:images[0].url})
        }).catch(error=>{
            return
        })
    }, [accessToken])
    return(
        
        <div className='userInfo'>
            {userDetails.name ?
            <p className='username'> {userDetails.name}</p>
            :
            <></>
            } 


            {
            userDetails.image ?
            <img src={userDetails.image} className='cover' />
            :
            <></>
            }

        </div>
    )

}