using ManagementPlane as service from '../../../srv/data-provider';

annotate service.KPIs @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: sectionID, 
    },
    {
        $Type: 'UI.DataField',
        Value: name, 
    },
    {
        $Type: 'UI.DataField',
        Value: state
    },
]});
