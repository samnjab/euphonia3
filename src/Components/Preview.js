export default function Preview ({item}){
    return (
        <>
            {
                item ?
                <div className='preview'>
                    <div className='img-box'>
                        <img className='cover' src={item?.imageUrl} />
                    </div>
                    <p className='title'>{item?.title}</p>
                    <p className='artist'>{item?.artist}</p>
        
                </div>
                :
                <></>

            }
        </>
    )
}