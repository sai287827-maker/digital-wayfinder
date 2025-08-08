import { useState, useEffect } from 'react';
import './WayFinderProjectInfo.css';
import { Link, useNavigate } from 'react-router-dom';
import dashboardImage from "../../assets/dashboard.png";
import { apiPost, apiGet } from '../../api';

const ProjectInfo = () => {
  const [projectType, setProjectType] = useState('internal');
  const [formData, setFormData] = useState({
    requestId: '',
    mmsId: '', // <-- Add MMSID field
    clientName: '',
    description: '',
    projectScope: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch project info from API on mount
    const fetchProjectInfo = async () => {
      setFetching(true);
      setError(null);
      try {
        const data = await apiGet('api/decision-tree/project-info/get');
        setFormData({
          requestId: data.requestID || '',
          mmsId: data.mmsID || '', // <-- Add MMSID field from API
          clientName: data.clientName || '',
          description: data.clientDescription || '',
          projectScope: data.projectScope || ''
        });
        setProjectType(data.projectType || 'internal');
      } catch (err) {
        // If error, keep fields empty
        setFormData({
          requestId: '',
          mmsId: '', // <-- Reset MMSID field
          clientName: '',
          description: '',
          projectScope: ''
        });
        setProjectType('internal');
      } finally {
        setFetching(false);
      }
    };
    fetchProjectInfo();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectTypeChange = (type) => {
    setProjectType(type);
    // Reset form data based on project type
    setFormData({
      requestId: '',
      mmsId: '', // <-- Reset MMSID field
      clientName: '',
      description: '',
      projectScope: ''
    });
  };

  const handleProceed = async () => {
    if (!formData.requestId.trim() || !formData.clientName.trim()) {
      alert('Please fill in all required fields (Request ID and Client/Project Name)');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiPost('api/decision-tree/project-info/save', {
        requestID: formData.requestId,
        mmsID: formData.mmsId, // <-- Send MMSID to API
        clientName: formData.clientName,
        clientDescription: formData.description,
        projectScope: formData.projectScope,
        projectType: projectType
      });
      navigate('/digital-wayfinder/functional-area', {
        state: {
          projectData: formData,
          projectType: projectType
        }
      });
    } catch (err) {
      setError('Failed to save project info. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="project-info-container"><div className="main-content"><p>Loading project information...</p></div></div>;
  }
console.log("formData",formData);
  return (
    <div className="project-info-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
           <Link to="/">Home</Link> &gt; 
          <span>Digital Wayfinder</span>
        </div>
        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button className="nav-tab active">Project Information</button>
          <button className="nav-tab">Functional Area</button>
          <button className="nav-tab">Industry Type</button>
        </div>
        {/* Content Grid */}
        <div className="content-grid">
          {/* Left Side - Form */}
          <div className="form-section">
            <h2 className="form-title">Project Information</h2>
            {/* Project Type Selection */}
            <div className="project-type-section">
              <p className="section-label">Select your project type</p>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="projectType"
                    value="internal"
                    checked={projectType === 'internal'}
                    onChange={() => handleProjectTypeChange('internal')}
                  />
                  <span className="radio-text">Internal Project</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="projectType"
                    value="client"
                    checked={projectType === 'client'}
                    onChange={() => handleProjectTypeChange('client')}
                  />
                  <span className="radio-text">Client Project</span>
                </label>
              </div>
            </div>
            {/* Form Fields */}
            <div className="form-fields">
              <p className="form-instruction">Enter the information to proceed</p>
              <div className="field-group">
                <label className="field-label">Request ID*</label>
                <input
                  type="text"
                  value={formData.requestId}
                  onChange={(e) => handleInputChange('requestId', e.target.value)}
                  className="field-input"
                  placeholder={projectType === 'internal' ? 'Enter Project ID' : 'Enter Request ID'}
                />
              </div>
              <div className="field-group">
                <label className="field-label">MMSID</label>
                <input
                  type="text"
                  value={formData.mmsId}
                  onChange={(e) => {
                    // Only allow alphanumeric input
                    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                    handleInputChange('mmsId', val);
                  }}
                  className="field-input"
                  placeholder="Enter MMSID (alphanumeric)"
                  maxLength={20}
                />
              </div>
              <div className="field-group">
                <label className="field-label">
                  {projectType === 'internal' ? 'Project Name*' : 'Client Name*'}
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="field-input"
                  placeholder={projectType === 'internal' ? 'Enter Project Name' : 'Enter Client Name'}
                />
              </div>
              <div className="field-group">
                <label className="field-label">
                  {projectType === 'internal' ? 'Project Description' : 'Client Description'}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="field-textarea"
                  placeholder={projectType === 'internal' ? 'Enter project description' : 'Enter client description'}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Project Scope</label>
                <textarea
                  value={formData.projectScope}
                  onChange={(e) => handleInputChange('projectScope', e.target.value)}
                  rows={4}
                  className="field-textarea"
                  placeholder="Enter project scope"
                />
              </div>
            </div>
            {/* Footer */}
            <div className="form-footer">
              <span className="step-indicator">Completed step 0 of 3</span>
              <button className="proceed-button" onClick={handleProceed} disabled={loading}>
                {loading ? 'Saving...' : 'Proceed'}
              </button>
              {error && <div className="form-error">{error}</div>}
            </div>
          </div>
          {/* Right Side - Dashboard Preview */}
          <div className="dashboard-section">
            <div className="dashboard-preview">
              <img 
                src={dashboardImage} 
                alt="Dashboard Preview" 
                className="dashboard-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;