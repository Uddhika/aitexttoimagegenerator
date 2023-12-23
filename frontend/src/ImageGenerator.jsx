import axios from 'axios';
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import heroimage from './assets/heroimage.png'
import Skeleton from 'react-loading-skeleton';

const ImageGenerator = () => {

    const[input, setInput] = useState('');
    const[img, setImg] = useState('');
    const[scaleimg, setScaleImg] = useState('');
    const[loading, setLoading] = useState('');
    const[imgno, setimgno] = useState(1);
    const[stylepreset, setstylepreset] = useState('');
    const[width, setwidth] = useState(512);
    const[height, setheight] = useState(512);

    async function upscaleImage(e){
        e.preventDefault();
        // console.log(img);
        let testimg = `data:image/png;base64,${img}`
        const blob = await fetch(testimg).then((res) => res.blob());
        // console.log(blob);
        const scheaders = {
            'Authorization': import.meta.env.VITE_SECRET_KEY,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        }
        const scdata = {
            image: blob
        }
        // console.log(scdata);
        setLoading('scaleload');
        await axios.post('https://api.stability.ai/v1/generation/esrgan-v1-x2plus/image-to-image/upscale', scdata ,{headers: scheaders}).then(response => {
            // console.log(response.data.artifacts[0].base64);
            setScaleImg(response.data.artifacts[0].base64);
            setLoading("scaledone");
            // console.log(response);
        }).catch(error => {
            console.log(error);
        })

    }

    async function generateImage(e){
        e.preventDefault();
        // console.log(data.text_prompts[0].text);
        if(input != ''){

            const headers = {
                'Authorization': import.meta.env.VITE_SECRET_KEY,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            const data = {
                cfg_scale : 7,
                clip_guidance_preset : "FAST_BLUE",
                height : height,
                width : width,
                sampler : "K_DPM_2_ANCESTRAL",
                samples : imgno,
                steps: 30,
                text_prompts: [
                  {
                    text : input,
                    weight : 1
                  }
                ],
                style_preset: stylepreset
              }

            setLoading("load");
            await axios.post('https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image', data ,{headers: headers}).then(response => {
                // console.log(response.data.artifacts[0].base64);
                setImg(response.data.artifacts[0].base64);
                setLoading("done");
            }).catch(error => {
                console.log(error);
            })
        }
        else{
            toast.error("Enter your text");
        }
    }

  return (
    <div className='mx-auto w-1/2'>
        <div>
            
            <textarea className="my-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Enter Your Text"
            onChange={(e) => {setInput(e.target.value)} }
            ></textarea>
            <div className='flex gap-5 justify-center'>

                <div className='flex gap-2'>
                    <label htmlFor="" className='flex items-center'>Width</label>
                    <input type="number" className='flex-none w-14 py-1.5 border-2 rounded-md ps-2' 
                    onChange={(e) => setwidth(e.target.value)} step="1" defaultValue="512" />
                </div>

                <div className='flex gap-2'>
                    <label htmlFor="" className='flex items-center'>Height</label>
                    <input type="number" className='flex-none w-14 py-1.5 border-2 rounded-md ps-2' 
                    onChange={(e) => setheight(e.target.value)} step="1" defaultValue="512" />
                </div>

                <div className='flex gap-2'>
                    <label htmlFor="" className='flex items-center'>Number of Images</label>
                    <input type="number" className='flex-none w-14 py-1.5 border-2 rounded-md ps-2' 
                    onChange={(e) => setimgno(e.target.value)} step="1" defaultValue="1"/>
                </div>
                <div className='flex items-center'>
                    <select className='py-1.5 px-3 border-2 rounded-md' onChange={(e) => setstylepreset(e.target.value)}>
                        <option value="">Select Style</option>
                        <option value="3d-model">3D Model</option>
                        <option value="analog-film">Analog Film</option>
                        <option value="anime">Anime</option>
                        <option value="cinematic">Cinematic</option>
                        <option value="comic-book">Comic Book</option>
                        <option value="digital-art">Digital Art</option>
                        <option value="enhance">Enhance</option>
                        <option value="fantasy-art">Fantasy Art</option>
                        <option value="isometric">Isometric</option>
                        <option value="line-art">Line Art</option>
                        <option value="low-poly">Low Poly</option>
                        <option value="modeling-compound">Modeling Compound</option>
                        <option value="neon-punk">Neon Punk</option>
                        <option value="origami">Origami</option>
                        <option value="photographic">Photographic</option>
                        <option value="pixel-art">Pixel Art</option>
                        <option value="tile-texture">Tile Texture</option>
                    </select>
                </div>
            </div>
            <div className='flex justify-center my-5'>
                <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline" type="button"
                    onClick={generateImage}
                >
                    Generate
                </button>
            </div>
        </div>
        <div className='my-5'>
            {loading == "done" ? 

            <div>
                <img src={`data:image/png;base64, ${img}`} alt="" />
                <button className="my-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button"
                onClick={upscaleImage}
                >
                    Upscale
                </button>
            </div>

            : loading == "load" ? <p>Loading</p> : <img src={heroimage} alt="" />}
        </div>
        
        <div>
            { loading == 'scaledone' ? <img src={`data:image/png;base64, ${scaleimg}`} alt="" /> : loading == 'scaleload' ? <p>Loading</p> : <p></p>}
        </div>
        <Toaster />
    </div>
  )
}

export default ImageGenerator