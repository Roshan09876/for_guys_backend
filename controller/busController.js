const Bus = require("../models/busModel");
const cloudinary = require("cloudinary");
const User = require("../models/userModel")

const createBus = async (req, res) => {
    const { title, description, busType, ticketPrice } = req.body;
    console.log(req.body);
    const { image } = req.files;
    console.log(req.files);

    if (!title || !description || !busType || !ticketPrice) {
        return res.status(400).json({
            success: false,
            message: "Please Enter all fields"
        });
    }

    try {
        const uploadedImage = await cloudinary.v2.uploader.upload(
            image.path,
            {
                folder: "bus/bus",
                crop: "scale"
            }
        );

        const newBus = new Bus({
            title: title,
            description: description,
            busType: busType,
            ticketPrice: ticketPrice,
            image: uploadedImage.secure_url
        });

        await newBus.save();

        return res.status(201).json({
            success: true,
            newBus,
            message: 'Bus Created Successfully'
        });
    } catch (error) {
        console.log(`Error in createBus is ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getAllBus = async (req, res) => {
    try {
        const getAllBus = await Bus.find()
        console.log(getAllBus)
        res.status(200).json({
            success: true,
            message: "All Bus Fetch Successfully",
            getAllBus
        })
    } catch (error) {
        console.log(`Error in getallbus is ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getBusbyId = async (req, res) => {
    try {
        const getbus = await Bus.findById(req.params.id)
        console.log(getbus)
        res.status(200).json({
            success: true,
            getbus,
            message: "Bus Fetch Successfully"
        })
    } catch (error) {
        console.log(`Error in getbusbyID is ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const bookBus = async (req, res) => {
    const { userId, busId } = req.params;
    console.log('Received userId:', userId);
    console.log('Received busId:', busId);

    try {

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const existingBook = user.bookedBus.find(book => book.busId === busId);
        if (existingBook) {
            return res.status(404).json({
                success: false,
                message: "Bus Already Booked ",
            });
        }

        if (!user.bookedBus.includes(busId)) {
            user.bookedBus.push(busId);
            await user.save();
            return res.status(200).json({
                success: true,
                message: 'Bus Booked'
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'Bus already Booked'
            })
        }

    } catch (error) {
        console.error('Error in bookBus:', error);
        res.status(500).send('Internal Server Error');
    }
}

const getBookedBus = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('bookedBus');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const bookCompleted = user.bookedBus;
        if (bookCompleted.length === 0) {
            return res.status(404).json({ success: false, message: 'No completed books found for this user' });
        }
        res.status(200).json({ success: true, books: bookCompleted, message: 'Completed booked bus fetched successfully' });
    } catch (error) {
        console.error('Error in getBookedBus:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const deletebookedBus = async (req, res) => {
    const { userId, bookId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const bookIndex = user.bookedBus.indexOf(bookId);
        if (bookIndex > -1) {
            user.bookedBus.splice(bookIndex, 1);
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
    createBus, getAllBus, getBusbyId, bookBus, getBookedBus, deletebookedBus
};
