using {
    Sections   as DBSections,
    KPIs       as DBKPIs,
    Documents  as DBDocuments
} from '../db/data-models';

@require: 'authenticated-user'
service ManagementPlane {
    entity Sections   as projection on DBSections;
    entity Documents  as projection on DBDocuments;

    entity KPIs       as
        projection on DBKPIs {
            *,
            (
                subchapterID || ' para. ' || paragraph
            ) as subChapter : String
        };
}
