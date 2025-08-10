import React from 'react';
import './HelpDocPopover.css';

const DOC_URL = 'https://ts.accenture.com/:w:/r/sites/SCPlanningandFulfilmentDecisionTree/_layouts/15/doc2.aspx?sourcedoc=%7BF4D7CF45-42BC-4D18-A6A1-37607222D8F6%7D&file=Help%20Doc%20-%20Digital%20Wayfinder_Decision%20Tree.docx&action=default&mobileredirect=true&wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1753255009567&web=1';

const HelpDocPopover = () => {
  return (
    <div className="helpdoc-popover">
      <div className="helpdoc-title">Help Document</div>
      <iframe
        src={DOC_URL}
        title="Help Document"
        width="400"
        height="300"
        frameBorder="0"
        style={{ borderRadius: '8px', background: '#fff' }}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <div className="helpdoc-fallback">
        If the document does not load, <a href={DOC_URL} target="_blank" rel="noopener noreferrer">click here to open it in a new tab</a>.
      </div>
    </div>
  );
};

export default HelpDocPopover; 