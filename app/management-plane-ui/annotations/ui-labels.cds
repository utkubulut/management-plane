using ManagementPlane as service from '../../../srv/data-provider';

annotate service.KPIs with {
    ID          @Common.Label: '{i18n>kpiID}';
    description @Common.Label: '{i18n>description}';
    name        @Common.Label: '{i18n>name}';
    paragraph   @Common.Label: '{i18n>paragraph}';
    state       @Common.Label: '{i18n>state}';
    title       @Common.Label: '{i18n>title}';
    sectionID   @Common.Label: '{i18n>sectionID}';
}
