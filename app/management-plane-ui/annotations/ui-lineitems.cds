using ManagementPlane as service from '../../../srv/data-provider';

annotate service.KPIs @(UI: {
    SelectionFields: [
        AIStatus,
        userStatus,
        totalStatus
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: subChapter,
        },
        {
            $Type: 'UI.DataField',
            Value: state
        },
        {
            $Type: 'UI.DataField',
            Value: modifiedAt,
        },
        {
            $Type: 'UI.DataField',
            Value: modifiedBy,
        }
    ]
});

annotate service.VKPIs @(UI: {
    
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: kpiChapterID  
        },
        {
            $Type: 'UI.DataField',
            Value: kpiReportDate
        }
    ]
});

annotate service.VKPIsReports @(UI: {
    
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: contentAI  
        },
        {
            $Type: 'UI.DataField',
            Value: contentEdited
        }
    ]
});

annotate service.Documents@(UI: {
    
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: title  
        },
        {
            $Type: 'UI.DataField',
            Value: type
        },
        {
            $Type: 'UI.DataField',
            Value: reportLine
        },
        {
            $Type: 'UI.DataField',
            Value: tags  
        },
        {
            $Type: 'UI.DataField',
            Value: lastModified  
        }
    ]
});
annotate service.ReportSet @(UI: {
    SelectionFields: [
        reportTitle,
        status,
        creator,
        lastModified
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: reportTitle,
        },
        {
            $Type: 'UI.DataField',
            Value: description
        },
        {
            $Type: 'UI.DataField',
            Value: status,
        },
        {
            $Type: 'UI.DataField',
            Value: lastModified,
        },
        {
            $Type: 'UI.DataField',
            Value: creator
        }
    ]
});
