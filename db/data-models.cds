using {managed} from '@sap/cds/common';

entity Sections {
    key ID      : UUID;
        type    : String;
        name    : String;
        sapIcon : String;
        toKPIs  : Association to many KPIs
                      on toKPIs.sectionID = $self.ID;
}

entity KPIs : managed {
    key ID             : UUID;
    key paragraph      : String;
        sectionID      : UUID;
        chapterID      : String;
        chapterName    : String;
        subchapterID   : String;
        subchapterName : String;
        subDescription : String;
        state          : String;
        AIStatus       : String;
        userStatus     : String;
        totalStatus    : String;
        contentAI      : String;
        contentEdited  : String;
        reportDate     : DateTime;
        documentCount  : Integer;
        documents      : Association to many Documents
                             on documents.kpiID = $self.ID;
}

entity Documents {
    key ID           : UUID;
        kpiID        : UUID;
        reportID     : UUID;
        title        : String;
        textLine     : String;
        page         : Integer;
        type         : String;
        AIMatch      : Integer;
        reportLine   : String;
        tags         : String;
        directory    : String;
        url          : String;
        lastModified : DateTime @cds.on.insert: $now;

}

entity ReportHistory {
    key ID              : UUID;
    key fullName        : String;
    key modifiedType    : String;
        reportDate      : DateTime @cds.on.insert: $now;
        modifiedContent : String;
        avatar          : String;
        iconType        : String;
}

entity ReportSet {
    key reportID     : UUID;
        reportTitle  : String(255);
        reportURL    : String(255);
        description  : String(500);
        status       : String(20);
        lastModified : DateTime;
        creator      : String(100);
        documents    : Association to many Documents
                           on documents.reportID = $self.reportID;
}
