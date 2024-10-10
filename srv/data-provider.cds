using {
    Sections      as DBSections,
    KPIs          as DBKPIs,
    Documents     as DBDocuments,
    ReportHistory as DBReportHistory,
    ReportSet     as DBReportSet
} from '../db/data-models';

//@requires: 'authenticated-user'
service ManagementPlane {
    entity Sections       as projection on DBSections;
    entity Documents      as projection on DBDocuments;
    entity ReportHistory  as projection on DBReportHistory;
    entity ReportSet      as projection on DBReportSet;

    entity KPIs           as
        projection on DBKPIs {
            *,
            (
                subchapterID
            )     as subChapter : String,
            case
                when
                    chapterID like 'E%'
                then
                    'sap-icon://e-care'
                when
                    chapterID like 'S%'
                then
                    'sap-icon://jam'
                when
                    chapterID like 'G%'
                then
                    'sap-icon://official-service'
                 when
                    chapterID like 'U%'
                then
                    'sap-icon://upload'
                else
                    'sap-icon://e-care'
            end   as sapIcon    : String,
            (
                    select count(
                        distinct state
                    ) from DBKPIs
                ) as stateCount : Integer

            };

    entity VKPIs          as
        select from DBSections as sec
        left outer join DBKPIs as kpi
            on sec.ID = kpi.sectionID
        {

            key kpi.ID             as kpiID             : UUID,
                kpi.sectionID      as sectionID         : UUID,
                kpi.reportID       as reportID          :UUID,
                sec.type           as sectionType       : String,
                sec.name           as sectionName       : String,
                kpi.chapterID      as kpiChapterID      : String,
                kpi.chapterName    as kpiChapterName    : String,
                kpi.state          as kpiState          : String,
                kpi.reportDate     as kpiReportDate     : Date,
                kpi.subchapterName as kpiSubChapterName : String,
                kpi.contentAI      as contentAI         : String,
                kpi.contentEdited  as contentEdited     : String
        }

    entity VKPIsReports   as
        select from KPIs as vkpi {
            key vkpi.ID            as kpiID         : UUID,
            key vkpi.paragraph     as kpiParagraph  : String,
                vkpi.contentAI     as contentAI     : String,
                vkpi.contentEdited as contentEdited : String
        }

    entity VKPIDocuments as projection on KPIs as kpi {
        *,
        (select count(*) from Documents as doc where doc.kpiID = kpi.ID ) as documentCount : Integer
    };

    entity VReportSet as projection on ReportSet as reportSet {
        *,
        (select count(*) from Documents as doc where doc.reportID = reportSet.reportID ) as documentCount : Integer
    };



    entity VKPIStateCount as
        select from VKPIs as kpi {
            key kpi.sectionID,
                kpi.sectionType,
                kpi.kpiState,
                count(
                    kpi.kpiState
                ) as kpiStateCount : Integer

        }
        group by
            kpi.sectionType,
            kpi.kpiState,
            kpi.sectionID;

}
