import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadProductsFile, uploadSalesFile, uploadInventoryFile } from '../services/analyticsService';
import './DataUpload.css';

const DataUpload = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('products');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      //hsh
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Please select a valid CSV or Excel file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);
    setUploadProgress(0);

    try {
      let uploadResult;
      const onProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      };

      if (selectedType === 'products') {
        uploadResult = await uploadProductsFile(file, onProgress);
      } else if (selectedType === 'sales') {
        uploadResult = await uploadSalesFile(file, onProgress);
      } else if (selectedType === 'inventory') {
        uploadResult = await uploadInventoryFile(file, onProgress);
      }

      setResult(uploadResult);
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Upload error:', err);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getTemplate = () => {
    const templates = {
      products: 'productId,name,category,costPrice,sellingPrice,reorderLevel,description,unit\nPROD001,Cotton Fabric,Cotton,500,750,10,High quality cotton,meters\nPROD002,Polyester Blend,Polyester,400,650,15,Durable polyester fabric,meters\nPROD003,Silk Material,Silk,1200,1800,5,Premium silk fabric,meters',
      sales: 'invoiceId,productId,productName,quantitySold,unitPrice,totalAmount,costPrice,saleDate,customerName,region,paymentStatus,salesPerson\nINV001,PROD001,Cotton Fabric,100,750,75000,500,2024-01-15,ABC Corp,North,Paid,John Doe\nINV002,PROD002,Polyester Blend,50,650,32500,400,2024-01-16,XYZ Ltd,South,Paid,Jane Smith\nINV003,PROD003,Silk Material,25,1800,45000,1200,2024-01-17,DEF Inc,East,Pending,Bob Wilson',
      inventory: 'productId,productName,quantityInStock,reorderLevel,maxStockLevel,warehouseLocation,lastRestockDate\nPROD001,Cotton Fabric,500,10,1000,Main Warehouse,2024-01-01\nPROD002,Polyester Blend,300,15,800,Main Warehouse,2024-01-05\nPROD003,Silk Material,150,5,500,Premium Warehouse,2024-01-10'
    };

    const blob = new Blob([templates[selectedType]], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="data-upload-container">
      <button className="back-button" onClick={() => navigate(-1)}>
         Back
      </button>
      <div className="upload-header">
        <h2> Data Upload</h2>
        <p>Upload CSV or Excel files to import data into the system</p>
      </div>

      <div className="upload-card">
        <div className="upload-form">
          <div className="form-group">
            <label>Select Data Type</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="select-input"
              disabled={uploading}
            >
              <option value="products">Products</option>
              <option value="sales">Sales</option>
              <option value="inventory">Inventory</option>
            </select>
          </div>

          <div className="form-group">
            <label>Choose File</label>
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="file-input"
              disabled={uploading}
            />
            {file && (
              <div className="file-info">
                <span className="file-name"> {file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
              </div>
            )}
          </div>

          <div className="button-group">
            <button 
              onClick={handleUpload} 
              className="btn btn-primary"
              disabled={!file || uploading}
            >
              {uploading ? `Uploading... ${uploadProgress}%` : 'Upload File'}
            </button>
            <button 
              onClick={getTemplate} 
              className="btn btn-secondary"
              disabled={uploading}
            >
              Download Template
            </button>
          </div>

          {uploading && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </div>

        {result && (
          <div className="result-box success">
            <h3> Upload Successful</h3>
            <div className="result-stats">
              <div className="stat">
                <span className="stat-label">Total Rows:</span>
                <span className="stat-value">{result.totalRows}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Successful:</span>
                <span className="stat-value success-text">{result.successCount}</span>
              </div>
              {result.newCount !== undefined && (
                <div className="stat">
                  <span className="stat-label">New:</span>
                  <span className="stat-value">{result.newCount}</span>
                </div>
              )}
              {result.updateCount !== undefined && (
                <div className="stat">
                  <span className="stat-label">Updated:</span>
                  <span className="stat-value">{result.updateCount}</span>
                </div>
              )}
              {result.errorCount > 0 && (
                <div className="stat">
                  <span className="stat-label">Errors:</span>
                  <span className="stat-value error-text">{result.errorCount}</span>
                </div>
              )}
            </div>
            {result.errors && result.errors.length > 0 && (
              <div className="error-list">
                <h4>Errors:</h4>
                <ul>
                  {result.errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="result-box error">
            <h3> Upload Failed</h3>
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="upload-instructions">
        <h3> Instructions</h3>
        <ul>
          <li>Download the template file for the data type you want to upload</li>
          <li>Fill in your data following the template format</li>
          <li>Save the file as CSV or Excel (.xlsx)</li>
          <li>Select the data type and upload your file</li>
          <li>Review the upload results for any errors</li>
        </ul>
      </div>
    </div>
  );
};

export default DataUpload;
