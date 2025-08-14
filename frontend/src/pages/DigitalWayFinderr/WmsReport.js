import React, { useEffect, useState } from 'react';
import './WmsReport.css';

const WmsReport = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await apiGet('api/digital-wayfinder/questionnaire/report');
        // Map the response to desired structure
        if (response && response.reportData) {
          setReportData(response.reportData.map(item => ({
            assetName: item.assetName,
            category: item.category,
            gaps: item.gaps
          })));
        }
      } catch (error) {
        console.error('Failed to fetch report:', error);
      }
    }
    fetchReport();
  }, []);

  const renderIcon = (id) => {
    switch (id) {
      case 1:
        return (
          <div className="icon-container">
            <div className="icon-wrapper">
              <div className="image-overlay" style={{backgroundImage: 'url(/api/placeholder/320/192)'}} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="icon-container">
            <div className="icon-wrapper">
              <div className="operations-icon">
                <div className="operations-icon-inner"></div>
              </div>
              <div className="operations-line"></div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="icon-container">
            <div className="icon-wrapper">
              <div className="innovations-icon">
                <div className="innovations-icon-center"></div>
              </div>
              <div className="innovations-dot-1"></div>
              <div className="innovations-dot-2"></div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="icon-container">
            <div className="icon-wrapper">
              <div className="ai-icon">
                <div className="ai-icon-inner">
                  <div className="ai-icon-center"></div>
                </div>
              </div>
              <div className="ai-dot-1"></div>
              <div className="ai-dot-2"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="assessment-container">
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
        </div>

        {/* Report Cards */}
        <div className="report-cards">
          {reportData.map((item, index) => (
            <div key={index} className="report-card">
              <div className="report-card-content">
                {/* Image Section */}
                <div className="image-section">
                  {renderIcon(index % 4 + 1)}
                </div>

                {/* Content Section */}
                <div className="content-section">
                  <div className="content-wrapper">
                    {/* Category */}
                    <div>
                      <p className="category-label">CATEGORY</p>
                      <h3 className="category-title">{item.category}</h3>
                    </div>

                    {/* Gaps Identified */}
                    <div>
                      <p className="section-label">GAPS IDENTIFIED</p>
                      <div className="tags-container">
                        {item.gaps.map((gap, idx) => (
                          <span key={idx} className="tag tag-gap">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Solutions */}
                    {item.solutions && item.solutions.length > 0 && (
                      <div>
                        <p className="section-label">SOLUTIONS</p>
                        <div className="tags-container">
                          {item.solutions.map((solution, idx) => (
                            <span key={idx} className="tag tag-solution">
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
          ))}
        </div>

        {/* Download Button */}
        <div className="download-section">
          <button className="download-button">
            <svg className="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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