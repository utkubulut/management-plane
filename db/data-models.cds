entity Sections {
    key ID      : UUID;
        type    : String;
        name    : String;
        sapIcon : String;
        toKPIs  : Association to many KPIs
                      on toKPIs.sectionID = $self.ID;
}

entity KPIs {
    key ID          : UUID;
        sectionID  : UUID;
        name        : String;
        title       : String;
        description : String;
        details     : Association to many KPIDetails
                          on details.KPI_ID = $self.ID;
}

entity KPIDetails {
    key ID             : UUID;
        KPI_ID         : UUID;
        name           : String;
        status         : String;
        paragraph      : String;
        content        : String;
        reportDate     : DateTime;
        documentNumber : Integer;
        documents      : Association to many Documents
                             on documents.KPIDetailsID = $self.ID;
}

entity Documents {
    key ID            : UUID;
        KPIDetailsID : UUID;
        title         : String;
        textLine      : String;
        page          : Integer;
        type          : String;
        AIMatch       : Integer;
        categorie     : String;
}
