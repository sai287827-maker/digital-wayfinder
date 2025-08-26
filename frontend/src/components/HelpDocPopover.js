import React from 'react';
import './HelpDocPopover.css';

function HelpDocPopover({ onDownload }) {
  const DOC_URL = 'https://ts.accenture.com/:w:/r/sites/SCPlanningandFulfilmentDecisionTree/_layouts/15/doc2.aspx?sourcedoc=%7BF4D7CF45-42BC-4D18-A6A1-37607222D8F6%7D&file=Help%20Doc%20-%20Digital%20Wayfinder_Decision%20Tree.docx&action=default&mobileredirect=true&wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1753255009567&web=1';

  const handleViewInNewTab = () => {
    window.open(DOC_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="help-popover">
      <div className="help-popover-header">
        <h3>Help Document</h3>
      </div>
      
      <div className="help-popover-content">
        {/* Help Document Information */}
        <div className="document-info-brief">
          <div className="info-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#4A90E2" fillOpacity="0.1"/>
              <circle cx="20" cy="20" r="16" fill="#4A90E2"/>
              <path d="M20 12V28M12 20H28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          <div className="info-content">
            <h4>Digital Wayfinder Help Document</h4>
            <p>This comprehensive help document contains detailed information about using the Digital Wayfinder and Decision Tree features. It includes step-by-step guides, troubleshooting tips, and best practices to help you navigate the platform effectively.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons-section">
          <button 
            className="view-tab-button"
            onClick={handleViewInNewTab}
            aria-label="View help document in new tab"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View in New Tab
          </button>

          <button 
            className="download-button"
            onClick={onDownload}
            aria-label="Download help documentation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Help Document
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpDocPopover;