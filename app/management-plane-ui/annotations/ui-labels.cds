using ManagementPlane as service from '../../../srv/data-provider';

annotate service.KPIs with {
    ID          @Common.Label: '{i18n>kpiID}';
    description @Common.Label: '{i18n>description}';
    name        @Common.Label: '{i18n>name}';
    paragraph   @Common.Label: '{i18n>paragraph}';
    state       @Common.Label: '{i18n>state}';
    title       @Common.Label: '{i18n>title}';
    sectionID   @Common.Label: '{i18n>sectionID}';
    subChapter  @Common.Label: '{i18n>subChapter}';
    modifiedAt  @Common.Label: '{i18n>modifiedAt}';
    modifiedBy  @Common.Label: '{i18n>modifiedBy}';
    createdAt   @Common.Label: '{i18n>createdAt}';
    createdBy   @Common.Label: '{i18n>createdBy}';
    AIStatus    @Common.Label: '{i18n>AIStatus}';
    userStatus  @Common.Label: '{i18n>userStatus}';
    totalStatus @Common.Label: '{i18n>totalStatus}';
}
