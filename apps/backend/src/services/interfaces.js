class Interface {
    
    #services = {
        dashboard: 'dashboard',
        outIms: 'our-ims',
        inventory: 'inventory',
        riskManagement: 'risk-management',
        incidentManagement: 'incident-management',
        audit: 'audit',
        managementReview: 'management-review',
        continualImprovementPlan: 'continual-improvement-plan',
        complianceTool: 'compliance-tool',
        supplierManagement: 'supplier-management',
        documentManagement: 'document-management',
        taskManager: 'task-manager',
        calender: 'calender',
        projectManagement: 'project-management'
    }
    #resources = {
        all: 'all',
        organizationalDashboard: 'organizational-dashboard',
        groupDashboard: 'groupdashboard',
        organizationalDocuments: 'organizational-documents'
    }
    #actions = {
        all: 'all',
        create:'create',
        read:'read',
        update:'update',
        delete:'delete'
        // readOrganizationalDashbiard:'',
        // readGroupDashbiard:'',
        // sendOrganizationalDashbaordReport:'',
        // sendGroupDashboardRepor:'',
        // createInventories:'',
        // readInventories:'',
        // deleteInventories:'',
        // updateInventories:'',
        // createRisks:'',
        // readRisks:'',
        // deleteRisks:'',
        // updateRisks:'',
        // createIncidentss:'',
        // readIncidents:'',
        // deleteIncidents:'',
        // updateIncidents:'',
        // createAudits:'',
        // readAudits:'',
        // deleteAudits:'',
        // updateAudits:'',
        // createManagementReviews:'',
        // readManagementReviews:'',
        // deleteManagementReviews:'',
        // updateManagementReviews:'',
        // createKpiObjectives:'',
        // readKpiObjectives:'',
        // deleteKpiObjectives:'',
        // updateKpiObjectives:'',
        // readCompliences:'',
        // deleteCompliences:'',
        // updateCompliences:'',
        // createDocuments:'',
        // readTasks:'',
        // deleteTasks:'',
        // updateTasks:'',
        // createTasks:'',
        // readTasks:'',
        // deleteTasks:'',
        // updateTasks:'',
        // createCalenderEvents:'',
        // readCalenderEvents:'',
        // deleteCalenderEvents:'',
        // updateCalenderEvents:'',

    }
    constructor() {

    }
    getServices(){
        return this.#services
    }
    getResources(){
        return this.#resources
    }
    getActions(){
        return this.#actions
    }
}

module.exports = Interface