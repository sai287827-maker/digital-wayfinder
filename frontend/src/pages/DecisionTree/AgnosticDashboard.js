import React, { useState, useEffect } from 'react';
import { Home, ChevronRight, Info, BarChart3, GitCompare, Target, TrendingUp} from 'lucide-react';
import styles from './Dashboard.module.css';
import DecisionSummaryModal from './DecisionSummaryModal';
import { apiGet } from '../../api';
 
const AgnosticDashboard = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPowerBI, setShowPowerBI] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [projectInfo, solutions, criteria] = await Promise.all([
          apiGet('api/decision-tree/project-info'),
          apiGet('api/decision-tree/functional-scope/solution/get-all'),
          apiGet('api/decision-tree/functional-scope/decision-criteria/get-details')
        ]);
        setDashboardData({ projectInfo, solutions, criteria });
        // Auto-show Power BI report when dashboard loads
        setShowPowerBI(true);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        // Even if API fails, show Power BI report
        setShowPowerBI(true);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);
 
  // Fallback to sample data if API fails or is loading
  const samplePowerBIData = {
    industryAgnostic: {
      industry: "XXXXXXX",
      function: "XXXXXXX"
    },
    wmsSystems: [
      { name: "BY WMS", percentage: 94.2, color: "#9333EA" },
      { name: "SAP WMS", percentage: 92.1, color: "#1E40AF" },
      { name: "Manhattan WMS", percentage: 87.7, color: "#059669" },
      { name: "Oracle WMS", percentage: 78.0, color: "#DC2626" },
      { name: "Korber WMS", percentage: 71.6, color: "#374151" }
    ],
    decisionPoints: {
      total: 128,
      functional: 56,
      nonFunctional: 79,
      functionalCriteria: [
        { name: "L0", count: 1 },
        { name: "L1", count: 1 },
        { name: "L2", count: 1 },
        { name: "L3", count: 1 }
      ],
      nonFunctionalCriteria: [
        { name: "Architecture", count: 1 },
        { name: "Data", count: 1 },
        { name: "Product Support", count: 1 },
        { name: "Security", count: 1 }
      ]
    },
    sankeyData: {
      functional: [
        { name: "BY WMS", value: 98.7 },
        { name: "SAP WMS", value: 100.0 },
        { name: "Manhattan WMS", value: 91.6 },
        { name: "Oracle WMS", value: 91.2 },
        { name: "Korber WMS", value: 83.6 }
      ],
      architecture: [
        { name: "BY WMS", value: 96.1 },
        { name: "SAP WMS", value: 100.0 },
        { name: "Manhattan WMS", value: 88.9 },
        { name: "Oracle WMS", value: 74.4 },
        { name: "Korber WMS", value: 77.8 }
      ]
    }
  };
 
  // Use real data if available, otherwise fallback
  const powerBIData = dashboardData || samplePowerBIData;
 
  const breadcrumbs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Decision Tree", href: "/decision-tree" },
    { label: "Functional Scope", href: "/functional-scope" },
    { label: "Advance Dashboards", href: "/advance-dashboards" }
  ];
 
  const sidebarItems = [
    { name: "Functional Scope", icon: Target, active: false },
    { name: "Non Functional Scope", icon: GitCompare, active: false },
    { name: "Appendix", icon: TrendingUp, active: false }
  ];
 
  const togglePowerBIView = () => {
    setShowPowerBI(!showPowerBI);
  };
 
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardLayout}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            {sidebarItems.map((item, index) => (
              <div key={index} className={styles.sidebarItemContainer}>
                <div className={`${styles.sidebarItem} ${item.active ? styles.sidebarItemActive : ''}`}>
                  <item.icon className={styles.sidebarIcon} />
                  <span className={styles.sidebarLabel}>{item.name}</span>
                </div>
                {item.active && item.description && showTooltip && (
                  <div className={styles.tooltip}>
                    <div className={styles.tooltipTitle}>{item.name}</div>
                    <div className={styles.tooltipDescription}>{item.description}</div>
                    <div className={styles.tooltipArrow}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
 
        <div className={styles.mainContent}>
          {/* Breadcrumb Row */}
          <div className={styles.breadcrumbRow}>
            <div className={styles.breadcrumbs}>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <div className={styles.breadcrumbItem}>
                    {index === 0 && <item.icon className={styles.breadcrumbIcon} />}
                    <a
                      href={item.href}
                      className={`${styles.breadcrumbLink} ${index === 0 ? styles.breadcrumbHome : ''}`}
                    >
                      {item.label}
                    </a>
                  </div>
                  {index < breadcrumbs.length - 1 && <ChevronRight className={styles.breadcrumbSeparator} />}
                </React.Fragment>
              ))}
            </div>
          </div>
 
          <div className={styles.dashboardHeader}>
            <div className={styles.dashboardTitleContainer}>
              <h1 className={styles.dashboardTitle}>Executive Dashboard</h1>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={styles.infoButton}
              >
                <Info className={styles.infoIcon} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className={styles.viewSummaryBtn}
                onClick={() => setShowModal(true)}
              >
                View Summary
              </button>
              <button
                className={styles.viewSummaryBtn}
                onClick={togglePowerBIView}
                style={{ backgroundColor: showPowerBI ? '#dc2626' : '#059669' }}
              >
                {showPowerBI ? 'Hide Power BI Report' : 'Show Power BI Report'}
              </button>
            </div>
          </div>
 
          {/* <div className={styles.lastUpdated}>
            Last Updated on Mon 14-Apr-2025 , 2:50PM
          </div> */}
 
          {/* Power BI Report Section - Full Screen */}
          {showPowerBI && (
            <div style={{
              width: '100%',
              height: '80vh',
              marginBottom: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                fontWeight: '600',
                fontSize: '16px',
                color: '#374151'
              }}>
                Power BI Dashboard Report
              </div>
              <iframe
                title="Power BI Report Dashboard"
                src="https://app.powerbi.com/reportEmbed?reportId=aa37619c-b039-405b-82b5-40f7f86b027b&autoAuth=true&ctid=e0793d39-0939-496d-b129-198edd916feb"
                style={{
                  width: "100%",
                  height: "calc(100% - 53px)",
                  border: "none",
                  display: 'block'
                }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
 
          {/* Original Dashboard Content - Only show when Power BI is hidden */}
          {!showPowerBI && (
            <div className={styles.powerbiContent}>
              {/* Top Row - Industry Agnostic and WMS Chart */}
              <div className={styles.contentRow}>
                <div className={`${styles.card} ${styles.industryCard}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                      <BarChart3 className={styles.icon} />
                    </div>
                    <div>
                      <h3 className={styles.cardTitle}>Industry Agnostic</h3>
                      <div className={styles.cardUnderline}></div>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.industryInfo}>
                      Industry: <span className={styles.industryValue}>{powerBIData.industryAgnostic.industry}</span>
                    </div>
                    <div className={styles.industryInfo}>
                      Function: <span className={styles.industryValue}>{powerBIData.industryAgnostic.function}</span>
                    </div>
                  </div>
                </div>
 
                <div className={`${styles.card} ${styles.wmsChart}`}>
                  <div className={styles.wmsBars}>
                    {powerBIData.wmsSystems.map((system, index) => (
                      <div key={index} className={styles.wmsBarContainer}>
                        <div
                          className={styles.wmsBar}
                          style={{
                            backgroundColor: system.color,
                            height: `${system.percentage}%`
                          }}
                        >
                          <div className={styles.wmsPercentage}>{system.percentage}%</div>
                        </div>
                        <div className={styles.wmsLabel}>{system.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
 
              {/* Bottom Row - Decision Points and Sankey Chart */}
              <div className={styles.contentRow}>
                <div className={`${styles.card} ${styles.decisionCard}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconPurple}>
                      <Target className={styles.icon} />
                    </div>
                    <div>
                      <h3 className={styles.cardTitle}>Decision Points</h3>
                      <h4 className={styles.decisionSubtitle}>Evaluated: {powerBIData.decisionPoints.total}</h4>
                      <div className={styles.cardUnderline}></div>
                    </div>
                  </div>
 
                  <div className={styles.decisionContent}>
                    <div className={styles.decisionSection}>
                      <h4 className={styles.decisionSectionTitle}>Functional {powerBIData.decisionPoints.functional}</h4>
                      <div className={styles.criteriaTable}>
                        <div className={styles.tableHeader}>
                          <span>Criteria</span>
                          <span>Count</span>
                        </div>
                        {powerBIData.decisionPoints.functionalCriteria.map((item, index) => (
                          <div key={index} className={styles.tableRow}>
                            <span>{item.name}</span>
                            <span>{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
 
                    <div className={styles.decisionSection}>
                      <h4 className={styles.decisionSectionTitle}>Non-Functional {powerBIData.decisionPoints.nonFunctional}</h4>
                      <div className={styles.criteriaTable}>
                        <div className={styles.tableHeader}>
                          <span>Criteria</span>
                          <span>Count</span>
                        </div>
                        {powerBIData.decisionPoints.nonFunctionalCriteria.map((item, index) => (
                          <div key={index} className={styles.tableRow}>
                            <span>{item.name}</span>
                            <span>{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
 
                  <button className={styles.viewWeightagesBtn}>View Weightages</button>
                </div>
 
                <div className={`${styles.card} ${styles.sankeyCard}`}>
                  <div className={styles.sankeyPlaceholder}>
                    <div className={styles.sankeyFlow}>
                      <div className={styles.flowColumn}>
                        <div className={styles.flowHeader}>Functional</div>
                        <div className={styles.flowItems}>
                          {powerBIData.sankeyData.functional.map((item, index) => (
                            <div
                              key={index}
                              className={styles.flowItem}
                              style={{ backgroundColor: powerBIData.wmsSystems[index]?.color }}
                            >
                              {item.value}%
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={styles.flowColumn}>
                        <div className={styles.flowHeader}>Architecture</div>
                        <div className={styles.flowItems}>
                          {powerBIData.sankeyData.architecture.map((item, index) => (
                            <div
                              key={index}
                              className={styles.flowItem}
                              style={{ backgroundColor: powerBIData.wmsSystems[index]?.color }}
                            >
                              {item.value}%
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={styles.flowColumn}>
                        <div className={styles.flowHeader}>Data</div>
                        <div className={styles.flowItems}>
                          <div className={styles.flowItem} style={{ backgroundColor: "#9333EA" }}>77.8%</div>
                          <div className={styles.flowItem} style={{ backgroundColor: "#1E40AF" }}>100.0%</div>
                          <div className={styles.flowItem} style={{ backgroundColor: "#059669" }}>100.0%</div>
                          <div className={styles.flowItem} style={{ backgroundColor: "#DC2626" }}>100.0%</div>
                          <div className={styles.flowItem} style={{ backgroundColor: "#374151" }}>88.8%</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.sankeyLegend}>
                      <div className={styles.legendItem}><div className={styles.legendColor} style={{ backgroundColor: "#9333EA" }}></div>BY WMS</div>
                      <div className={styles.legendItem}><div className={styles.legendColor} style={{ backgroundColor: "#374151" }}></div>Korber WMS</div>
                      <div className={styles.legendItem}><div className={styles.legendColor} style={{ backgroundColor: "#059669" }}></div>Manhattan WMS</div>
                      <div className={styles.legendItem}><div className={styles.legendColor} style={{ backgroundColor: "#DC2626" }}></div>Oracle WMS</div>
                      <div className={styles.legendItem}><div className={styles.legendColor} style={{ backgroundColor: "#1E40AF" }}></div>SAP WMS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <DecisionSummaryModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  );
};
 
export default AgnosticDashboard;