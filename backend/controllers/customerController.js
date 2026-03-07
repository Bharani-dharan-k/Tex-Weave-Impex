import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// @desc    Get customer profile
// @route   GET /api/customer/profile
// @access  Private (Customer)
export const getCustomerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      profile: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
};

// @desc    Update customer profile
// @route   PUT /api/customer/profile
// @access  Private (Customer)
export const updateCustomerProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      companyName,
      customerType,
      gstNumber,
      billingAddress,
      shippingAddress,
      preferences
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (companyName !== undefined) user.companyName = companyName;
    if (customerType !== undefined) user.customerType = customerType;
    if (gstNumber !== undefined) user.gstNumber = gstNumber;

    // Update billing address
    if (billingAddress) {
      user.billingAddress = {
        ...user.billingAddress,
        ...billingAddress
      };
    }

    // Update shipping address
    if (shippingAddress) {
      user.shippingAddress = {
        ...user.shippingAddress,
        ...shippingAddress
      };
    }

    // Update preferences
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle unique constraint errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists. Please use a different ${field}.` 
      });
    }

    res.status(500).json({ 
      message: 'Error updating profile',
      error: error.message 
    });
  }
};

// @desc    Copy billing address to shipping address
// @route   POST /api/customer/profile/copy-address
// @access  Private (Customer)
export const copyBillingToShipping = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Copy billing address to shipping address
    user.shippingAddress = {
      street: user.billingAddress.street,
      city: user.billingAddress.city,
      state: user.billingAddress.state,
      country: user.billingAddress.country,
      pincode: user.billingAddress.pincode
    };

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'Billing address copied to shipping address',
      profile: updatedUser
    });
  } catch (error) {
    console.error('Copy address error:', error);
    res.status(500).json({ 
      message: 'Error copying address',
      error: error.message 
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/customer/profile/upload-picture
// @access  Private (Customer)
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile picture from Cloudinary if it exists
    if (user.profilePicture) {
      try {
        const publicId = user.profilePicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
      } catch (error) {
        console.error('Error deleting old profile picture:', error);
      }
    }

    // Convert buffer to stream for Cloudinary upload
    const uploadStream = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'profile_pictures',
            transformation: [
              { width: 500, height: 500, crop: 'fill', gravity: 'face' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        Readable.from(buffer).pipe(stream);
      });
    };

    const result = await uploadStream(req.file.buffer);

    // Update user profile picture
    user.profilePicture = result.secure_url;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture: result.secure_url
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ 
      message: 'Error uploading profile picture',
      error: error.message 
    });
  }
};

// @desc    Get saved addresses
// @route   GET /api/customer/addresses
// @access  Private (Customer)
export const getSavedAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedAddresses');

    res.json({
      success: true,
      addresses: user.savedAddresses || []
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message
    });
  }
};

// @desc    Add new address
// @route   POST /api/customer/addresses
// @access  Private (Customer)
export const addAddress = async (req, res) => {
  try {
    const { label, street, city, state, country, pincode, phone, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this is default, unset other defaults
    if (isDefault) {
      user.savedAddresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.savedAddresses.push({
      label,
      street,
      city,
      state,
      country: country || 'India',
      pincode,
      phone,
      isDefault: isDefault || false
    });

    await user.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      addresses: user.savedAddresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding address',
      error: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/customer/addresses/:addressId
// @access  Private (Customer)
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, street, city, state, country, pincode, phone, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.savedAddresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting this as default, unset others
    if (isDefault) {
      user.savedAddresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.pincode = pincode || address.pincode;
    address.phone = phone || address.phone;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.savedAddresses
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/customer/addresses/:addressId
// @access  Private (Customer)
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.savedAddresses.pull(addressId);
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.savedAddresses
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
};

// @desc    Set default address
// @route   PUT /api/customer/addresses/:addressId/set-default
// @access  Private (Customer)
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Unset all defaults
    user.savedAddresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set new default
    const address = user.savedAddresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    address.isDefault = true;
    await user.save();

    res.json({
      success: true,
      message: 'Default address updated',
      addresses: user.savedAddresses
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting default address',
      error: error.message
    });
  }
};
