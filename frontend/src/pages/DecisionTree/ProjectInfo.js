import { useState, useRef, useEffect } from "react";
import "./ProjectInfo.css";
import { Link, useNavigate } from "react-router-dom";
import dashboardImage from "../../assets/dashboard.png";
import { apiPost } from "../../api";

const ProjectInfo = () => {
  const [projectType, setProjectType] = useState("internal");
  const [formData, setFormData] = useState({
    requestId: "",
    mmsId: "", // <-- Add MMSID field
    clientName: "",
    description: "",
    projectScope: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Create refs for mandatory input field
  const requestIdRef = useRef(null);
  const clientNameRef = useRef(null);
  const mmsIdRef = useRef(null);

  const navigate = useNavigate();

  // Scroll to top only once on initial mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    /*
    Previously the component fetched project info from the backend on mount
    using `apiGet('api/decision-tree/project-info/get')`. There is currently
    no requirement to fetch ProjectInfo from the backend, so the fetch logic
    has been commented out. If fetching is required in the future, restore
    the code below and re-import `apiGet`.
    
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
         */
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProjectTypeChange = (type) => {
    setProjectType(type);
    // Reset form data based on project type
    setFormData({
      requestId: "",
      mmsId: "", // <-- Reset MMSID field
      clientName: "",
      description: "",
      projectScope: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};
    // Check which fields are empty
    if (!formData.requestId.trim()) {
      newErrors.requestId = "Request ID is required.";
    }
    // MMSID is only mandatory for client projects
    if (projectType === "client" && !formData.mmsId.trim()) {
      newErrors.mmsId = "MMS ID is required for client projects.";
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client/Project Name is required.";
    }
    return newErrors;
  };

  const handleProceed = async () => {
    const findErrors = validateForm();

    if (Object.keys(findErrors).length > 0) {
      setErrors(findErrors);

      // 1. Identify first error field
      const firstErrorField = Object.keys(findErrors)[0];

      // 2. Map field names to refs so we can focus and scroll to the correct one
      const refMap = {
        requestId: requestIdRef,
        mmsId: mmsIdRef,
        clientName: clientNameRef,
      };
      const fieldRef = refMap[firstErrorField];
      const element = fieldRef && fieldRef.current ? fieldRef.current : null;
      if (element) {
        element.focus(); // Focus the input field with error
        const rect = element.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const navbarHeight = 70; // Fixed navbar height from Navbar.css
        const padding = 20; // Extra padding for better visibility
        const targetY = rect.top + scrollTop - navbarHeight - padding;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    } else {
      setErrors({});
      setLoading(true);
      try {
        await apiPost("api/decision-tree/project-info/save", {
          requestID: formData.requestId,
          mmsID: formData.mmsId,
          clientName: formData.clientName,
          clientDescription: formData.description,
          projectScope: formData.projectScope,
          projectType: projectType,
        });
        console.log("Project Info submitted successfully:", formData);
        navigate("/decision-tree/functional-area", {
          state: {
            projectData: formData,
            projectType: projectType,
          },
        });
      } catch (err) {
        setErrors({ save: "Failed to save project info. Please try again." });
      } finally {
        setLoading(false);
      }
    }
  };

  // if (fetching) {
  //   return <div className="project-info-container"><div className="main-content"><p>Loading project information...</p></div></div>;
  // }
  return (
    <div className="project-info-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt;
          <span>Decision Tree</span>
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
                    checked={projectType === "internal"}
                    onChange={() => handleProjectTypeChange("internal")}
                  />
                  <span className="radio-text">Internal Project</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="projectType"
                    value="client"
                    checked={projectType === "client"}
                    onChange={() => handleProjectTypeChange("client")}
                  />
                  <span className="radio-text">Client Project</span>
                </label>
              </div>
            </div>
            {/* Form Fields */}
            <div className="form-fields">
              <p className="form-instruction">
                Enter the information to proceed
              </p>
              <div className="field-group">
                <label className="field-label">Request ID*</label>
                <input
                  ref={requestIdRef}
                  type="text"
                  value={formData.requestId}
                  onChange={(e) =>
                    handleInputChange("requestId", e.target.value)
                  }
                  className={`field-input ${errors.requestId ? "input-error" : ""}`}
                  placeholder={
                    projectType === "internal"
                      ? "Enter Project ID"
                      : "Enter Request ID"
                  }
                />
                {/* Render error only if it exists */}
                {errors.requestId && (
                  <span style={{ color: "red" }}>{errors.requestId}</span>
                )}
              </div>
              {/* Show MMS ID only for client projects. For internal projects it's hidden. */}
              {projectType === "client" && (
                <div className="field-group">
                  <label className="field-label">
                    MMS ID{projectType === "client" ? "*" : ""}
                  </label>
                  <input
                    ref={mmsIdRef}
                    type="text"
                    value={formData.mmsId}
                    onChange={(e) => {
                      // Only allow alphanumeric input
                      const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                      handleInputChange("mmsId", val);
                    }}
                    className={`field-input ${errors.mmsId ? "input-error" : ""}`}
                    placeholder="Enter MMSID (alphanumeric)"
                    maxLength={20}
                  />
                  {errors.mmsId && (
                    <span style={{ color: "red" }}>{errors.mmsId}</span>
                  )}
                </div>
              )}
              <div className="field-group">
                <label className="field-label">
                  {projectType === "internal"
                    ? "Project Name*"
                    : "Client Name*"}
                </label>
                <input
                  ref={clientNameRef}
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    handleInputChange("clientName", e.target.value)
                  }
                  className={`field-input ${errors.clientName ? "input-error" : ""}`}
                  placeholder={
                    projectType === "internal"
                      ? "Enter Project Name"
                      : "Enter Client Name"
                  }
                />
                {errors.clientName && (
                  <span style={{ color: "red" }}>{errors.clientName}</span>
                )}
              </div>
              <div className="field-group">
                <label className="field-label">
                  {projectType === "internal"
                    ? "Project Description"
                    : "Client Description"}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="field-textarea"
                  placeholder={
                    projectType === "internal"
                      ? "Enter project description"
                      : "Enter client description"
                  }
                />
              </div>
              <div className="field-group">
                <label className="field-label">Project Scope</label>
                <textarea
                  value={formData.projectScope}
                  onChange={(e) =>
                    handleInputChange("projectScope", e.target.value)
                  }
                  rows={4}
                  className="field-textarea"
                  placeholder="Enter project scope"
                />
              </div>
            </div>
            {/* Footer */}
            <div className="form-footer">
              <span className="step-indicator">Completed step 0 of 3</span>
              <button
                className="proceed-button"
                onClick={handleProceed}
                disabled={loading}
              >
                {loading ? "Saving..." : "Proceed"}
              </button>
              {errors && <div className="form-error">{errors.save}</div>}
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
