import React, { useState, useEffect } from "react";
import {
  Home,
  ChevronRight,
  Info,
  BarChart3,
  Target,
} from "lucide-react";
import styles from "./Dashboard.module.css";
import DecisionSummaryModal from "./DecisionSummaryModal";
import { apiGet } from "../../api";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";

const ExecutiveDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPowerBI, setShowPowerBI] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [embedConfig, setEmbedConfig] = useState(null);
  const [embedLoading, setEmbedLoading] = useState(true);
  const [embedError, setEmbedError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);

      try {
        const solutionsPromise = apiGet(
          "api/decision-tree/functional-scope/solution/get-all",
        );
        const criteriaPromise = apiGet(
          "api/decision-tree/functional-scope/decision-criteria/get-details",
        );
        const projectInfoPromise = apiGet("api/decision-tree/project-info"); // may fail

        const [solutions, criteria] = await Promise.all([
          solutionsPromise,
          criteriaPromise,
        ]);

        let projectInfo = null;

        try {
          projectInfo = await projectInfoPromise; // try separately
        } catch (e) {
          console.warn("project-info failed, ignoring");
        }

        setDashboardData({ projectInfo, solutions, criteria });
        setShowPowerBI(true);
      } catch (err) {
        console.error("Critical API failed:", err);
        setError("Failed to fetch dashboard data.");
        setShowPowerBI(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  useEffect(() => {
    async function fetchEmbedConfig() {
      setEmbedLoading(true);
      setEmbedError(null);

      try {
        const response = await fetch(
          "http://localhost:8080/api/powerbi/embed-config?reportId=571474de-cb68-4323-a9bb-9fd60b50db96",
        );

        if (!response.ok) {
          throw new Error(`Embed config request failed with status ${response.status}`);
        }

        const res = await response.json();

        setEmbedConfig({
          type: "report",
          id: res.reportId,
          embedUrl: res.embedUrl,
          accessToken: res.embedToken,
          tokenType: models.TokenType.Embed,
        });
      } catch (err) {
        console.error("Power BI Error", err);
        setEmbedError(
          "Unable to load the Power BI report. Please refresh the page or try again later.",
        );
      } finally {
        setEmbedLoading(false);
      }
    }

    fetchEmbedConfig();
  }, []);

  const powerBIData = dashboardData;

  const breadcrumbs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Decision Tree", href: "/decision-tree" },
    { label: "Functional Scope", href: "/functional-scope" },
    { label: "Advance Dashboards", href: "/advance-dashboards" },
  ];

  const togglePowerBIView = () => {
    setShowPowerBI(!showPowerBI);
  };

  const formatValue = (val) =>
    val?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // ✅ Clean data (remove nulls)
  const cleanSolutions =
    dashboardData?.solutions?.filter((item) => item && item.sessionId) || [];

  // ✅ Get latest session based on createdDate
  const latestSolution = cleanSolutions.sort(
    (a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0),
  )[0];

  const currentSessionId = latestSolution?.sessionId;

  // ✅ Get platforms for that session
  const userPlatforms = cleanSolutions
    .filter((item) => item.sessionId === currentSessionId)
    .map((item) => item.platform);    
  
  // ✅ Build userSelections with all levels from all levelSelections
  const funcLevelSelections =
    dashboardData?.criteria?.functional?.levelSelections || [];
    
  const funcl1Set = new Set();
  const funcl2Set = new Set();
  const funcl3Set = new Set();
  const funcl4Set = new Set();
  const funcl5Set = new Set();

  funcLevelSelections.forEach((selection) => {
    if (selection.l1) funcl1Set.add(selection.l1?.trim());
    if (selection.l2) funcl2Set.add(selection.l2?.trim());
    if (selection.l3) funcl3Set.add(selection.l3?.trim());
    if (selection.l4) funcl4Set.add(selection.l4?.trim());
    if (selection.l5) funcl5Set.add(selection.l5?.trim());
  });
  
   const nonFuncLevelSelections =
    dashboardData?.criteria?.nonFunctional?.levelSelections || [];
    
  const nonFuncl1Set = new Set();
  const nonFuncl2Set = new Set();
  const nonFuncl3Set = new Set();
  

  nonFuncLevelSelections.forEach((selection) => {
    if (selection.l1) nonFuncl1Set.add(selection.l1?.trim());
    if (selection.l2) nonFuncl2Set.add(selection.l2?.trim());
    if (selection.l3) nonFuncl3Set.add(selection.l3?.trim());
  });
  //const userSelectionData = dashboardData.criteria.sessionId === currentSessionId ? dashboardData.criteria : null;
  const userSelectionsFunctional = {
    functionalArea: formatValue(dashboardData?.criteria?.functionalArea),
    l1: Array.from(funcl1Set),
    l2: Array.from(funcl2Set),
    l3: Array.from(funcl3Set),
    l4: Array.from(funcl4Set),
    l5: Array.from(funcl5Set),
    platforms: userPlatforms,
  };
   const userSelectionsNonFunctional = {
    functionalArea: formatValue(dashboardData?.criteria?.functionalArea),
    l1: Array.from(nonFuncl1Set),
    l2: Array.from(nonFuncl2Set),
    l3: Array.from(nonFuncl3Set),
    platforms: userPlatforms,
  };
  console.log("Latest Session:", currentSessionId);
  console.log("Platforms:", userPlatforms);
  console.log("Criteria:", dashboardData?.criteria);
  console.log("User Selections Functional:", userSelectionsFunctional);
  console.log("User Selections Non-Functional:", userSelectionsNonFunctional);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardLayout}>
        <div className={styles.mainContent}>
          {/* Breadcrumb Row */}
          <div className={styles.breadcrumbRow}>
            <div className={styles.breadcrumbs}>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <div className={styles.breadcrumbItem}>
                    {index === 0 && (
                      <item.icon className={styles.breadcrumbIcon} />
                    )}
                    <a
                      href={item.href}
                      className={`${styles.breadcrumbLink} ${index === 0 ? styles.breadcrumbHome : ""}`}
                    >
                      {item.label}
                    </a>
                  </div>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className={styles.breadcrumbSeparator} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className={styles.dashboardHeader}>
            <div className={styles.dashboardTitleContainer}>
              <h1 className={styles.dashboardTitle}>Executive Dashboard</h1>
              <button className={styles.infoButton}>
                <Info className={styles.infoIcon} />
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className={styles.viewSummaryBtn}
                onClick={() => setShowModal(true)}
              >
                View Summary
              </button>
              <button
                className={styles.viewSummaryBtn}
                onClick={togglePowerBIView}
                style={{ backgroundColor: showPowerBI ? "#dc2626" : "#059669" }}
              >
                {showPowerBI ? "Hide Power BI Report" : "Show Power BI Report"}
              </button>
            </div>
          </div>

          {/* <div className={styles.lastUpdated}>
            Last Updated on Mon 14-Apr-2025 , 2:50PM
          </div> */}

          {/* Power BI Report Section - Full Screen */}
          {showPowerBI && (
            <div
              style={{
                width: "100%",
                height: "calc(100vh - 200px)",
                marginBottom: "0",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "12px 16px",
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#374151",
                }}
              >
                Power BI Dashboard Report
              </div>

              {loading || embedLoading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <div>Loading Power BI report...</div>
                </div>
              ) : error || embedError ? (
                <div className={styles.errorMessage}>
                  {error || embedError}
                </div>
              ) : embedConfig ? (
                <PowerBIEmbed
                  embedConfig={embedConfig}
                  cssClassName={styles["report-style-class"]}
                  getEmbeddedComponent={(report) => {
                    report.on("loaded", () => {
                      console.log("Report loaded");
                      
                      report.getPages().then((pages) => {
                        // pages[0] = Functional, pages[1] = Non-Functional, pages[2] = Appendix
                        console.log("report pages", pages);
                        // Functional Page Filters (L1-L5, Platforms)
                        const functionalFilters = [];
                        const functionalTable = "vw_WMS_Functional_Unpivoted"; 

                        if (userSelectionsFunctional.l1.length > 0) {
                          functionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: functionalTable, column: "L1" },
                            operator: "In",
                            values: userSelectionsFunctional.l1,
                            filterType: models.FilterType.Basic,
                          });
                        }
                        if (userSelectionsFunctional.l2.length > 0) {
                          functionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: functionalTable, column: "L2" },
                            operator: "In",
                            values: userSelectionsFunctional.l2,
                            filterType: models.FilterType.Basic,
                          });
                        }
                        if (userSelectionsFunctional.l3.length > 0) {
                          functionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: functionalTable, column: "L3" },
                            operator: "In",
                            values: userSelectionsFunctional.l3,
                            filterType: models.FilterType.Basic,
                          });
                        }
                        if (userSelectionsFunctional.l4.length > 0) {
                          functionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: functionalTable, column: "L4" },
                            operator: "In",
                            values: userSelectionsFunctional.l4,
                            filterType: models.FilterType.Basic,
                          });
                        }
                        if (userSelectionsFunctional.l5.length > 0) {
                          functionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: functionalTable, column: "L5" },
                            operator: "In",
                            values: userSelectionsFunctional.l5,
                            filterType: models.FilterType.Basic,
                          });
                        }
                        if (userSelectionsFunctional.platforms.length > 0) {
                          functionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: functionalTable, column: "PlatformName" },
                            operator: "In",
                            values: userSelectionsFunctional.platforms,
                            filterType: models.FilterType.Basic,
                          });
                        }

                        if (pages[0]) {
                          pages[0].setFilters(functionalFilters)
                            .then(() => console.log("Functional page filters applied"))
                            .catch((err) => console.error("Error setting functional filters", err));
                        }

                        // Non-Functional Page Filters (L1-L3, Platforms)
                        const nonFunctionalFilters = [];
                        const nonFunctionalTable = "vw_WMS_Non_Functional_Unpivoted"; 

                        if (userSelectionsNonFunctional.l1.length > 0) {
                          nonFunctionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: nonFunctionalTable, column: "L1" },
                            operator: "In",
                            values: userSelectionsNonFunctional.l1,
                            filterType: models.FilterType.Basic,
                          });
                        }
                        if (userSelectionsNonFunctional.l2.length > 0) {
                          nonFunctionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: nonFunctionalTable, column: "L2" },
                            operator: "In",
                            values: userSelectionsNonFunctional.l2,
                            filterType: models.FilterType.Basic,
                          });
                        }
                        if (userSelectionsNonFunctional.l3.length > 0) {
                          nonFunctionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: nonFunctionalTable, column: "L3" },
                            operator: "In",
                            values: userSelectionsNonFunctional.l3,
                            filterType: models.FilterType.Basic,
                          });
                        }
                        // Add platforms for the non-functional view
                        if (userSelectionsNonFunctional.platforms.length > 0) {
                          nonFunctionalFilters.push({
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: { table: nonFunctionalTable, column: "PlatformName" },
                            operator: "In",
                            values: userSelectionsNonFunctional.platforms,
                            filterType: models.FilterType.Basic,
                          });
                        }

                        if (pages[1]) {
                          pages[1].setFilters(nonFunctionalFilters)
                            .then(() => console.log("Non-functional page filters applied"))
                            .catch((err) => console.error("Error setting non-functional filters", err));
                        }

                        // Appendix Page - No filters or specific filters as needed
                        // pages[2].setFilters([]); // If needed
                      }).catch((err) => console.error("Error getting pages", err));
                    });
                  }}
                />
              ) : (
                <div className={styles.errorMessage}>
                  Power BI configuration could not be loaded.
                </div>
              )}
            </div>
          )}

          {/* Original Dashboard Content - Only show when Power BI is hidden */}
          {!showPowerBI && (
            <div className={styles.powerbiContent}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <div>Loading dashboard data...</div>
                </div>
              ) : error ? (
                <div className={styles.errorMessage}>{error}</div>
              ) : !dashboardData ? (
                <div className={styles.errorMessage}>
                  No dashboard data is available at the moment.
                </div>
              ) : (
                <div>
                  <div className={styles.infoMessage}>
                    Dashboard data is available. Please use the Power BI report view to
                    explore the latest insights.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <DecisionSummaryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
