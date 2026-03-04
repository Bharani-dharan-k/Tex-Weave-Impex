import User from '../models/User.js';

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
