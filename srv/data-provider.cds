using {
    Sections   as DBSections,
    KPIs       as DBKPIs,
    KPIDetails as DBKPIDetails,
    Documents  as DBDocuments
} from '../db/data-models';

@require:'authenticated-user'
service ManagementPlane {
    entity Sections   as projection on DBSections;
    entity KPIs       as projection on DBKPIs;
    entity KPIDetails as projection on DBKPIDetails;
    entity Documents  as projection on DBDocuments;
}
