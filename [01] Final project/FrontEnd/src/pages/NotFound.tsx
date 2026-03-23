import PageNotFound from '../assets/Group 197.svg'
function NotFound() {
    return (
        <div className='flex justify-center items-center'>
         <img className='max-h-150' src={PageNotFound} alt="not-found-image" />
        </div>
    )
}

export default NotFound
