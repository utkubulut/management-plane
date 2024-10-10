using ManagementPlane as service from '../../../srv/data-provider';

annotate service.KPIs with {
    ID             @Common.Label: '{i18n>kpiID}';
    chapterID       @Common.Label: '{i18n>chapterID}';
    chapterName    @Common.Label: '{i18n>chapterName}';
    subChapter     @Common.Label: '{i18n>subChapter}';
    topic          @Common.Label: '{i18n>topic}';
    subchapterID   @Common.Label: '{i18n>subchapterID}';
    subchapterName @Common.Label: '{i18n>subchapterName}';
    subDescription @Common.Label: '{i18n>subDescription}';
    paragraph      @Common.Label: '{i18n>paragraph}';
    state          @Common.Label: '{i18n>state}';
    sectionID      @Common.Label: '{i18n>sectionID}';
    modifiedAt     @Common.Label: '{i18n>modifiedAt}';
    modifiedBy     @Common.Label: '{i18n>modifiedBy}';
    createdAt      @Common.Label: '{i18n>createdAt}';
    createdBy      @Common.Label: '{i18n>createdBy}';
    AIStatus       @Common.Label: '{i18n>AIStatus}';
    userStatus     @Common.Label: '{i18n>userStatus}';
    totalStatus    @Common.Label: '{i18n>totalStatus}';
}
annotate service.VKPIs with {
   
    kpiReportDate    @Common.Label: '{i18n>kpiReportDate}';
    kpiChapterID     @Common.Label: '{i18n>kpiChapterID}';
}
annotate service.VKPIsReports with {
   
    contentAI          @Common.Label: '{i18n>reportAI}';
    contentEdited      @Common.Label: '{i18n>reportEdited}';
         
}
annotate service.Documents with {
   
    title          @Common.Label: '{i18n>docTitle}';
    type           @Common.Label: '{i18n>docType}';
    reportLine     @Common.Label: '{i18n>docReportLine}';
    kpiID          @Common.Label: '{i18n>docKPIId}';
    reportID       @Common.Label: '{i18n>docReportID}';
    textLine       @Common.Label: '{i18n>docReportTextLine}';
    page           @Common.Label: '{i18n>docReportPage}';
    AIMatch        @Common.Label: '{i18n>docReportAIMatch}';
    tags           @Common.Label: '{i18n>docReportTags}';
    directory      @Common.Label: '{i18n>docReportDirectory}';
    url            @Common.Label: '{i18n>docReportUrl}';
    lastModified   @Common.Label: '{i18n>docReporLastModified}';

}
annotate service.ReportSet with {
   
    reportTitle          @Common.Label: '{i18n>reportTitle}';
    description          @Common.Label: '{i18n>description}';
    status               @Common.Label: '{i18n>status}';
    lastModified         @Common.Label : '{i18n>lastModified}';
    creator              @Common.Label: '{i18n>creator}';
}


