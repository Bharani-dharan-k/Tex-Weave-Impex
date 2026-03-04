# Data Upload - Quick Test Script

## Test the Upload Feature

### Step 1: Verify Backend is Running
Open a terminal and run:
```bash
cd D:\Final_Year\backend
npm start
```

You should see: "Server running on port 5000" and "MongoDB connected"

### Step 2: Verify Frontend is Running
Open another terminal and run:
```bash
cd D:\Final_Year\frontend
npm run dev
```

You should see: "Local: http://localhost:5173/"

### Step 3: Login
1. Open browser: http://localhost:5173/login
2. Login with your credentials

### Step 4: Navigate to Data Upload
- Click on "Data Upload" in the navigation menu
- Or go directly to: http://localhost:5173/data-upload

### Step 5: Test Upload with Sample Data

#### Test 1: Upload Products
1. Select "Products" from dropdown
2. Click "Download Template" to see the format
3. Click "Choose File" and select: `test_data/products_sample.csv`
4. Click "Upload File"
5. Wait for progress to complete
6. Verify success message shows:
   - Total Rows: 10
   - Successful: 10
   - New: 10

#### Test 2: Upload Sales
1. Select "Sales" from dropdown
2. Click "Choose File" and select: `test_data/sales_sample.csv`
3. Click "Upload File"
4. Verify success message shows sales data imported

#### Test 3: Upload Inventory
1. Select "Inventory" from dropdown
2. Click "Choose File" and select: `test_data/inventory_sample.csv`
3. Click "Upload File"
4. Verify success message shows inventory data imported

### Step 6: Verify Data in Database

You can verify the uploaded data by:
1. Going to the Analytics Dashboard
2. Checking the Products, Sales, and Inventory sections
3. Data should be visible in charts and tables

## Quick Verification Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] MongoDB connection is successful
- [ ] User is logged in
- [ ] Data Upload page loads without errors
- [ ] Template download works
- [ ] File selection works
- [ ] Upload progress bar appears
- [ ] Success message appears after upload
- [ ] Data appears in analytics dashboard

## Expected Results

### Products Upload
```
✅ Upload Successful
Total Rows: 10
Successful: 10
New: 10
Updated: 0
Errors: 0
```

### Sales Upload
```
✅ Upload Successful
Total Rows: 10
Successful: 10
Errors: 0
```

### Inventory Upload
```
✅ Upload Successful
Total Rows: 10
Successful: 10
Errors: 0
```

## Common Issues & Solutions

### Issue: Cannot access upload page
**Solution:** Make sure you're logged in first

### Issue: "Not authorized" error
**Solution:** 
1. Logout and login again
2. Check that JWT_SECRET is set in backend .env file
3. Verify token is being sent in request headers

### Issue: Upload button is disabled
**Solution:** Select a file first

### Issue: "Only CSV and Excel files allowed"
**Solution:** Make sure file has .csv, .xlsx, or .xls extension

### Issue: No data showing in analytics
**Solution:** 
1. Wait a few seconds and refresh the page
2. Check browser console for errors
3. Verify MongoDB connection

## Manual Testing with Postman/cURL

### Get Auth Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

### Upload Products (with token)
```bash
curl -X POST http://localhost:5000/api/upload/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@test_data/products_sample.csv"
```

## Success Indicators

1. ✅ Green success message appears
2. ✅ Upload statistics are displayed
3. ✅ No red error messages
4. ✅ File input is cleared after upload
5. ✅ Data appears in analytics dashboard

## What's Working

✅ **Backend:**
- Upload routes configured with authentication
- File parsing (CSV and Excel)
- Data validation
- Database operations (insert/update)
- Error handling and reporting
- Automatic file cleanup

✅ **Frontend:**
- File selection and validation
- Upload progress tracking
- Template download
- Result display
- Error messaging
- Session management

✅ **Integration:**
- API calls with authentication
- FormData handling
- Progress callbacks
- Error responses
- Success responses

## Next Steps

After successful upload test:
1. View data in Analytics Dashboard
2. Generate reports
3. Test with your own data
4. Upload additional records
5. Test update functionality (upload same productId with different data)

## Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Check backend terminal for server errors
3. Review the error message displayed
4. Verify file format matches template
5. Check MongoDB connection status
