export default function SearchResult({ item, selectTrack}) {
    return ( 
      <div
          style={{ cursor: "pointer" }}
          className='searchResult'
          onClick={()=> selectTrack(item)}
          >
          <img 
            src={item.imageUrl}
            className='cover'/>
          <div className='info'>
              <h5>{item.title}</h5>
              {
                  item.artist ?
                  <h5>{item.artist}</h5>
                  :
                  <></>
              }
          </div>
      </div>
    )
}