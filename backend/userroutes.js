import express from 'express';
import { Images, User } from './datamodel.js';

const router = express.Router();

router.post('/saveimages', async(request, response) => {
    const{email,images}=request.body;
    try{
        if(email && images){
            const checkUser = await User.findOne({email:email});
            // const hashpass = await bcrypt.hash(password, rounds);      
            if(checkUser){
                
                for(let i=0; i<images.length; i++){
                    images[i].user=checkUser._id;
                }
                const imageIds = await Promise.all(
                    images.map(async (image) => {
                        const newImage = await Images.create(image);
                        checkUser.images.push(newImage._id);
                        return newImage._id;
                    })
                );
                
                await checkUser.save();
                    
                response.json({
                    msg: "success",
                    user: checkUser,
                    // image: imageIds
                });
            }

            else{
                response.json('user is not found');
            }

        }

        else{
            response.json('please fill all details');
        }

    }
    catch(e){
        console.log(e);
    }
});

router.post('/signup', async(request, response) => {
    const{email,password,fname,lname}=request.body;
    try{
        if(email && password && fname && lname){
            const checkUser = await User.findOne({email:email});
            if(!checkUser){
                const newuser={
                    fname:fname,
                    lname:lname,
                    email:email,
                    password:password,
                }
                const newUser= await User.insertMany([newuser]);
                response.json(newUser);
            }

            else{
                response.json('user already exist');
            }

        }
        else{
            response.json('please fill all the details');
        }
    }
    catch(error){
        console.log(error);
    }
});

export default router;