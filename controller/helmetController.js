const Helmet = require("../models/HelmetModel");
const cloudinary = require("cloudinary");
const User = require("../models/userModel")

const createHelmet = async (req, res) => {
    const { title, description, helmetType, helmetPrice } = req.body;
    console.log(req.body);
    const { image } = req.files;
    console.log(req.files);

    if (!title || !description || !helmetType || !helmetPrice) {
        return res.status(400).json({
            success: false,
            message: "Please Enter all fields"
        });
    }

    try {
        const uploadedImage = await cloudinary.v2.uploader.upload(
            image.path,
            {
                folder: "helmet/helmet",
                crop: "scale"
            }
        );

        const newHelmet = new Helmet({
            title: title,
            description: description,
            helmetType: helmetType,
            helmetPrice: helmetPrice,
            image: uploadedImage.secure_url
        });


        await newHelmet.save();
        console.log(newHelmet)

        return res.status(201).json({
            success: true,
            newHelmet,
            message: 'Helmet Created Successfully'
        });
    } catch (error) {
        console.log(`Error in createBus is ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getAllHelmet = async (req, res) => {
    try {
        const getAllHelmet = await Helmet.find()
        console.log(getAllHelmet)
        res.status(200).json({
            success: true,
            message: "All Helmet Fetch Successfully",
            getAllHelmet
        })
    } catch (error) {
        console.log(`Error in getAllHelmet is ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


const bookHelmet = async (req, res) => {
    const { userId, helmetId } = req.params;

    console.log('Received userId:', userId);
    console.log('Received helmetId:', helmetId);

    if (!helmetId) {
        return res.status(400).json({
            success: false,
            message: 'Helmet ID is required',
        });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check for null or invalid values in bookedHelmet array
        const existingBook = user.bookedHelmet.find(book => book && book.toString() === helmetId);
        if (existingBook) {
            return res.status(400).json({
                success: false,
                message: "Helmet already booked",
            });
        }

        user.bookedHelmet.push(helmetId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Helmet booked successfully'
        });

    } catch (error) {
        console.error('Error in bookHelmet:', error);
        res.status(500).send('Internal Server Error');
    }
};


const getBookedHelmet = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('bookedHelmet');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const bookCompleted = user.bookedHelmet;
        if (bookCompleted.length === 0) {
            return res.status(404).json({ success: false, message: 'No completed books found for this user' });
        }
        res.status(200).json({ success: true, books: bookCompleted, message: 'Completed booked bus fetched successfully' });
    } catch (error) {
        console.error('Error in getBookedBus:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const deletebookedHelmet = async (req, res) => {
    const { userId, bookId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const bookIndex = user.bookedHelmet.indexOf(bookId);
        if (bookIndex > -1) {
            user.bookedHelmet.splice(bookIndex, 1);
            await user.save();
            return res.status(200).json({ success: true, message: 'Booking deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error in deletebookedBus:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports = {
    createHelmet, getAllHelmet, bookHelmet, getBookedHelmet, deletebookedHelmet
};
