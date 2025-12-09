import MDFormatedText from "@/components/MDFormated/MDFormatedText";
import React from "react";

const guidelines = `**Best practices for ESG & technology to support organisations implement , monitor & showcase ESG commitment and compliance.**
Toolkit is a set of tools and resources that can be embedded into your organisation to integrate ESG considerations into your decision-making processes. The toolkit typically includes various modules and functionalities that enable users to assess, monitor, and manage ESG risks and opportunities.
Here is an overview of the key components that can be included in an ESG toolkit:

**1.** ESG Data Integration: The toolkit should provide capabilities to integrate and aggregate ESG data from various sources, such as sustainability reports, regulatory filings, and third-party data providers. This data integration module ensures that users have access to comprehensive and up-to-date ESG information. -- **[iMS can pull in data from your esg softwares where you are capturing key metrics and data](#)**

**2.** ESG Risk Assessment: The toolkit should offer tools to assess and quantify the potential ESG risks associated with different business activities. This may involve evaluating factors such as carbon emissions, water usage, labor practices, and supply chain sustainability. The toolkit can provide risk scoring algorithms and visualization tools to help users understand and prioritize ESG risks. - **[iMS has this capability with ai to help you with the risk assessments and enable you to mitigate efficiently](/admin/risks/hardware)**

**3.** ESG Performance Monitoring: The toolkit should enable organizations to track and monitor their ESG performance over time. This can involve setting key performance indicators (KPIs) related to ESG goals and targets, and providing dashboards and reporting functionalities to visualize and analyze performance data. -- **[iMS allows you to set ESG  KIP's to each of your business areas, partners or suppliers through the management review module](/admin/risks/management-reviews)**

**4.** ESG Reporting and Disclosure: The toolkit should support the generation of ESG reports and disclosures required by stakeholders, such as investors, regulators, and customers. This may involve generating standardized ESG reports based on frameworks like the Global Reporting Initiative (GRI) or the Sustainability Accounting Standards Board (SASB). -- **[Automated reporting is available from the quick actions and your organisation settings to send pdf reports at the intervals you set](/admin/dashboard)**

**5.** ESG Compliance and Governance: The toolkit should include functionalities to ensure compliance with ESG regulations and standards. This may involve providing guidance on relevant regulations, automating compliance checks, and facilitating internal governance processes related to ESG. -- **[ESG toolkit and its guidance available under the compliance module, this is where you can also evidence your compliance and commitment. You can also grant access to interested parties access to your iMS to showcase .](/admin/groups)**

**6.** ESG Stakeholder Engagement: The toolkit can facilitate stakeholder engagement on ESG issues by providing communication and collaboration tools. This may include features like surveys, feedback mechanisms, and forums for engaging with employees, customers, suppliers, and other stakeholders. - **[You can create custom forms and send via the iMS Systems to communicate and collate information and data.](#)**

By following the above you can enhance your organisation's ability to integrate ESG considerations into decision-making processes, improve ESG performance, and meet the growing expectations of stakeholders regarding sustainability and responsible business practices.
`;

const ESGGuidelines = () => {
  return <MDFormatedText>{guidelines}</MDFormatedText>;
};

export default ESGGuidelines;
