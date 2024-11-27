import {Typography} from '@mui/material'
import Test from '../pages/Login';
import './step2.css';
 

const Step2 = () => {
  return (
  <section class='step2-section'>
  <div className="step2-content-wrapper">
    <div className="step2-text-span">
      <span>Step 2: Document photos with notes</span>
      </div>
      <div className="step2-text-p">
        <p>Every photo has a story to tell. Write down those precious moments and organize them with tags.
        View your photos in album mode where you can flip the photos to see the notes on the back, just like a real photo album.
        </p>
      </div>

  
    <div className="step2-img">
      <img src='/assets/baby.jpeg' alt='baby'/>
    </div>
  </div>
</section>
  )
}

export default Step2