import React, { useEffect, useState } from 'react';
import './WmsReport.css';
import { apiGet } from '../../api'; // Adjust the path if needed

// Import your images
import OperationsImage from '../../assets/Operations.jpg';
import DataCloudImage from '../../assets/DataCloud.jpg';
import OperationalInnovationImage from '../../assets/OperationalInnovation.webp';
import AIEngineImage from '../../assets/AI.webp';
import PlanningCropImage from '../../assets/planning-crop.png';

const WmsReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
 
  // Fallback data in case API fails
  const fallbackData = [
    {
      assetName: "Warehouse Management",
      category: "Operations",
      gaps: ["MHE and Warehouse Assets"],
      solutions: ["Warehouse Execution System", "IOT Ecosystem"]
    },
    {
      assetName: "Data Platform",
      category: "Data and Cloud",
      gaps: ["Unified Data Model"],
      solutions: ["Unified Data Model"]
    },
    {
      assetName: "Innovation Hub",
      category: "Operational Innovations",
      gaps: ["Automation System Integrations"],
      solutions: []
    },
    {
      assetName: "AI Engine",
      category: "Agentic AI",
      gaps: ["AI-Driven Decision Making", "Intelligent Process Automation"],
      solutions: ["Autonomous AI Agents", "Smart Decision Engine"]
    }
  ];
 
  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const response = await apiGet('api/digital-wayfinder/questionnaire/report');
        console.log('API Response:', response); // Debug log
       
        // Map the new response structure
        if (response && response.categories) {
          // Set user and session info
          setUserId(response.userId || '');
          setSessionId(response.sessionId || '');
         
          // Group assets by category and aggregate gaps and solutions
          const categoryMap = new Map();
         
          response.categories.forEach(category => {
            if (category.assets && Array.isArray(category.assets)) {
              if (!categoryMap.has(category.categoryName)) {
                categoryMap.set(category.categoryName, {
                  category: category.categoryName,
                  gaps: new Set(),
                  solutions: new Set(),
                  assetNames: []
                });
              }
             
              const categoryData = categoryMap.get(category.categoryName);
             
              category.assets.forEach(asset => {
                // Add asset name
                if (asset.assetName) {
                  categoryData.assetNames.push(asset.assetName);
                }
               
                // Add gaps (handle both string and array)
                if (asset.gaps) {
                  if (Array.isArray(asset.gaps)) {
                    asset.gaps.forEach(gap => categoryData.gaps.add(gap));
                  } else {
                    categoryData.gaps.add(asset.gaps);
                  }
                }
               
                // Add solutions (handle both string and array)
                if (asset.solutions) {
                  if (Array.isArray(asset.solutions)) {
                    asset.solutions.forEach(solution => categoryData.solutions.add(solution));
                  } else {
                    categoryData.solutions.add(asset.solutions);
                  }
                }
              });
            }
          });
         
          // Convert Map to array format expected by the component
          const transformedData = Array.from(categoryMap.values()).map(categoryData => ({
            category: categoryData.category,
            gaps: Array.from(categoryData.gaps),
            solutions: [...Array.from(categoryData.solutions), ...categoryData.assetNames] // Combine solutions and asset names
          }));
          
          // Define the desired order for categories
          const categoryOrder = [
            'Platform Analysis',
            'Platform Analysis- Core Functionalities',
            'Data & Cloud',
            'Data and Cloud', 
            'Operational Innovations',
            'Visibility and Proactive',
            'Visibility Proactive',
            'Visibility & Proactive Planning',
            'Agentic AI'
          ];
          
          // Sort the data according to the desired order
          transformedData.sort((a, b) => {
            const indexA = categoryOrder.findIndex(cat => 
              cat.toLowerCase() === a.category.toLowerCase() || 
              a.category.toLowerCase().includes(cat.toLowerCase()) ||
              cat.toLowerCase().includes(a.category.toLowerCase())
            );
            const indexB = categoryOrder.findIndex(cat => 
              cat.toLowerCase() === b.category.toLowerCase() || 
              b.category.toLowerCase().includes(cat.toLowerCase()) ||
              cat.toLowerCase().includes(b.category.toLowerCase())
            );
            
            // If both found, sort by order; if one not found, put it at end
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
          });
         
          console.log('Transformed and sorted data:', transformedData);
          setReportData(transformedData);
        } else if (response && response.reportData) {
          // Handle old response structure as fallback
          setReportData(response.reportData.map(item => ({
            assetName: item.assetName,
            category: item.category,
            gaps: item.gaps || [],
            solutions: item.solutions || []
          })));
        } else {
          console.warn('Unexpected API response structure:', response);
          setReportData(fallbackData);
        }
      } catch (error) {
        console.error('Failed to fetch report:', error);
        setError(error.message);
        // Use fallback data when API fails
        setReportData(fallbackData);
      } finally {
        setLoading(false);
      }
    }
   
    fetchReport();
  }, []);

  // Function to get the appropriate image for each category
  const getCategoryImage = (category, index) => {
    const categoryLower = category.toLowerCase();
    
    // Debug: Log the imported images
    console.log('Images loaded:', { OperationsImage, DataCloudImage, OperationalInnovationImage, AIEngineImage, PlanningCropImage });
    
    // Map categories to specific images based on your requirements
    if (categoryLower.includes('operations') || categoryLower.includes('warehouse')) {
      return OperationsImage;
    }
    if (categoryLower.includes('data') || categoryLower.includes('cloud')) {
      return DataCloudImage;
    }
    if (categoryLower.includes('innovation') || categoryLower.includes('operational innovation')) {
      return OperationalInnovationImage;
    }
    if (categoryLower.includes('ai') || categoryLower.includes('agentic')) {
      return AIEngineImage;
    }
    if (categoryLower.includes('planning') || categoryLower.includes('crop')) {
      return PlanningCropImage;
    }
    
    // Fallback: use Operations image for unmatched categories
    return OperationsImage;
  };

  const renderIcon = (category, index) => {
    const imageSource = getCategoryImage(category, index);
    
    // Debug: Log the image source
    console.log('Image source for category', category, ':', imageSource);
    
    // Use full cover image that fills the entire blue section
    return (
      <div className="icon-container" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        <img 
          src={imageSource} 
          alt={category}
          className="category-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
          onLoad={() => console.log(`Image loaded successfully: ${category}`)}
          onError={(e) => {
            console.error('Image failed to load for category:', category, 'Source:', imageSource);
            // Hide the image if it fails to load, showing the blue background
            e.target.style.display = 'none';
          }}
        />
        {/* Optional overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(30, 58, 138, 0.3)', // Semi-transparent blue overlay
          zIndex: 2
        }} />
      </div>
    );
  };
 
  const handleDownloadReport = async () => {
    try {
      const response = await fetch('/api/digital-wayfinder/questionnaire/report/download', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
 
      // Get the filename from the response headers or use a default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'assessment-report.pdf';
     
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
 
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="assessment-container">
        <div className="main-content">
          <div className="header-section">
            <h1 className="main-title">Loading Assessment Report...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container" style={{ maxWidth: '95vw', margin: '0 auto', padding: '0 1rem' }}>
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-container">
          <nav className="breadcrumb-nav">
            <span className="breadcrumb-link">Home</span>
            <span className="breadcrumb-separator"></span>
            <span className="breadcrumb-link">Digital Wayfinder</span>
            <span className="breadcrumb-separator"></span>
            <span className="breadcrumb-link">Questionnaire</span>
            <span className="breadcrumb-separator"></span>
            <span className="breadcrumb-current">Report</span>
          </nav>
        </div>
      </div>
 
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">Assessment Report</h1>
          <p className="main-description">
            We have analyzed capabilities in your current ERP system and recommend following solutions based on the questionnaire inputs and gaps identified in the current solution
          </p>
          {error && (
            <div className="error-message" style={{color: 'red', marginTop: '1rem'}}>
              API Error: {error} (Showing fallback data)
            </div>
          )}
        </div>
 
        {/* Report Cards */}
        <div className="report-cards" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
          {reportData.length > 0 ? reportData.map((item, index) => (
            <div key={index} className="report-card" style={{ 
              display: 'flex', 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              minHeight: '200px',
              width: '100%'
            }}>
              <div className="report-card-content" style={{ display: 'flex', width: '100%' }}>
                {/* Image Section - Increased width */}
                <div className="image-section" style={{ 
                  position: 'relative', 
                  width: '400px', 
                  minHeight: '200px',
                  backgroundColor: '#1e3a8a',
                  flexShrink: 0
                }}>
                  {renderIcon(item.category, index)}
                </div>
 
                {/* Content Section */}
                <div className="content-section" style={{ 
                  flex: 1, 
                  padding: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}>
                  <div className="content-wrapper">
                    {/* Category */}
                    <div style={{ marginBottom: '1rem' }}>
                      <p className="category-label" style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '600', 
                        color: '#6b7280', 
                        marginBottom: '0.25rem',
                        letterSpacing: '0.05em'
                      }}>CATEGORY</p>
                      <h3 className="category-title" style={{ 
                        fontSize: '1.75rem', 
                        fontWeight: '700', 
                        color: '#111827',
                        margin: 0,
                        lineHeight: '1.2'
                      }}>{item.category}</h3>
                    </div>
 
                    {/* Gaps Identified */}
                    {item.gaps && item.gaps.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <p className="section-label" style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: '#6b7280', 
                          marginBottom: '0.5rem',
                          letterSpacing: '0.05em'
                        }}>GAPS IDENTIFIED</p>
                        <div className="tags-container" style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '0.75rem' 
                        }}>
                          {item.gaps.map((gap, idx) => (
                            <span key={idx} className="tag tag-gap" style={{
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              padding: '0.75rem 1.25rem',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              border: '1px solid #fecaca'
                            }}>
                              {gap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
 
                    {/* Solutions */}
                    {item.solutions && item.solutions.length > 0 && (
                      <div>
                        <p className="section-label" style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: '#6b7280', 
                          marginBottom: '0.5rem',
                          letterSpacing: '0.05em'
                        }}>SOLUTIONS</p>
                        <div className="tags-container" style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '0.75rem' 
                        }}>
                          {item.solutions.map((solution, idx) => (
                            <span key={idx} className="tag tag-solution" style={{
                              backgroundColor: '#f0fdf4',
                              color: '#16a34a',
                              padding: '0.75rem 1.25rem',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              border: '1px solid #bbf7d0'
                            }}>
                              {solution}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="no-data-message">
              <p>No report data available.</p>
            </div>
          )}
        </div>
 
        {/* Download Button */}
        <div className="download-section" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '2rem' 
        }}>
          <button className="download-button" onClick={handleDownloadReport} style={{
            backgroundColor: '#9333ea',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s'
          }}>
            <svg className="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default WmsReport;