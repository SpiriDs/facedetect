import React, {
  Component
} from "react";
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from "./components/Navigation/Navigation";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";

const app = new Clarifai.App({
  apiKey: 'c475f0a601774324b48a701fca24cce2'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 1000
      }
    }


  }
}




class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      signedIn: false
    }
  }

  calculateFaceLocation = (data ) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
     
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),

      
      /* --This is not working. rightCol and BottomRow has to be like above */

      /* leftCol: clarifaiFace.top_row * 100 + '%',
      topRow: clarifaiFace.left_col * 100 + '%',
      rightCol:clarifaiFace.right_col * 100 + '%',
      bottomRow: clarifaiFace.bottom_row * 100 + '%' 
 */
      /* Object {
         bottomRow: 373.77838816, 
         leftCol: 131.91183, 
         rightCol: 358.55338, 
         topRow: 147.11212688 }
App.js:68 */
    }
  }


  displayFaceBox = (box) => {
    this.setState({box: box})
    console.log(box)
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
        .then (response => this.displayFaceBox(
          this.calculateFaceLocation(response)
        ) 
        )
        .catch (err => console.log(err))  
           
   }

   onRouteChange = (route) => {
     this.setState({route: route});
     if (route === 'home') {
      return(
        this.setState({signedIn: true})
      )
    }else{
      this.setState({signedIn: false})
    }
   } 

   /* signedIn = (route) => {
     if (route === 'home') {
       return(
         this.setState({signedIn: true})
       )
     }else{
       this.setState({signedIn: false})
     }
   } */

  render() {
    const { signedIn, imageUrl, route, box } = this.state; 
    return ( 
      <div className = "App">
        <Particles className = 'particles' params = {particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} signedIn={signedIn} />
        
        {
          route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/> 
              <FaceRecognition box={box} imageUrl={imageUrl} /> 
            </div>
          :
          (
            route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
          )  
        }
      </div>
    );
  }
}

export default App;