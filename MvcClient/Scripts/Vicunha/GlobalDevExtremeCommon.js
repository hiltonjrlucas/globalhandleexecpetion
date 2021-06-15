const DialogTypes = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    question: "question"
};
const returnDevExpressValidacao =
    (nameGrupoValidacao) => DevExpress.validationEngine.validateGroup(nameGrupoValidacao).isValid;

function DxRestart(id, type) {
    if ($(`#${id}`).data().dxComponents) {
        eval("$('#" + `${id}').${type}` + "('instance').dispose();");
    }
}

function DxSelectBox(component, options, validation = null) {
    DxRestart(component.id, 'dxSelectBox');

    const dxCommon = {
        displayExpr: component.description,
        valueExpr: component.value,
        placeHolder: 'Selecione...',
        searchEnabled: true,
        searchExpr: component.description,
        searchTimeout: 750,
        disabled: false
    };

    const ext = $.extend({}, dxCommon, options);
    const widget = $(`#${component.id}`).dxSelectBox(ext);

    if (validation) {
        DxValidator(widget, validation);
    }

    return widget.dxSelectBox('instance');
}

function DxTextBox(component, options, validation = null) {
    DxRestart(component.id, 'dxTextBox');

    const dxCommon = {};
    const ext = $.extend({}, dxCommon, options);
    const widget = $(`#${component.id}`).dxTextBox(ext);

    if (validation) {
        DxValidator(widget, validation);
    }

    return widget.dxTextBox('instance');
}

function DxDateBox(component, options, validation = null) {
    DxRestart(component.id, 'dxDateBox');

    const dxCommon = {
        displayFormat: 'dd/MM/yyyy',
        type: 'date',
        value: component.value ? component.value : moment().format(),
        useMaskBehavior: true
    };
    const ext = $.extend({}, dxCommon, options);
    const widget = $(`#${component.id}`).dxDateBox(ext);

    if (validation) {
        DxValidator(widget, validation);
    }

    return widget.dxDateBox('instance');
}

function DxNumberBox(component, options, validation = null) {
    DxRestart(component.id, 'dxNumberBox');

    const dxCommon = {};
    const ext = $.extend({}, dxCommon, options);
    const widget = $(`#${component.id}`).dxNumberBox(ext);

    if (validation) {
        DxValidator(widget, validation);
    }

    return widget.dxNumberBox('instance');
}

function DxTextArea(component, options, validation = null) {
    DxRestart(component.id, 'dxTextArea');

    const dxCommon = {
        height: 90
    };
    const ext = $.extend({}, dxCommon, options);
    const widget = $(`#${component.id}`).dxTextArea(ext);

    if (validation) {
        DxValidator(widget, validation);
    }

    return widget.dxTextArea('instance');
}

function DxRadioGroup(component, options, validation = null) {
    DxRestart(component.id, 'dxRadioGroup');

    const dxCommon = {
        layout: 'horizontal'
    };
    const ext = $.extend({}, dxCommon, options);
    const widget = $(`#${component.id}`).dxRadioGroup(ext);

    if (validation) {
        DxValidator(widget, validation);
    }

    return widget.dxRadioGroup('instance');
}

function DxCheckBox(component, options, validation = null) {
    DxRestart(component.id, 'dxCheckBox');

    const dxCommon = {
        value: false
    };
    const ext = $.extend({}, dxCommon, options);
    const widget = $(`#${component.id}`).dxCheckBox(ext);

    if (validation) {
        widget.dxValidator({
            validationGroup: validation.group || '',
            validationRules: validation.rules
        });
    }

    return widget.dxCheckBox('instance');
}

function DxDataGrid(component, options) {
    DxRestart(component.id, 'dxDataGrid');

    const dxGridCommonOptions =
    {
        showColumnLines: false,
        showBorders: false,
        showRowLines: false,
        allowColumnResizing: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        columnHidingEnabled: false,
        selection: { mode: 'single' },
        columnFixing: {
            enabled: true
        },
        columnAutoWidth: true,
        loadPanel: {
            enabled: false
        },
        searchPanel: {
            visible: true,
            width: 150
        },
        "export": {
            enabled: true,
            fileName: "Grid",
            allowExportSelectedData: false
        },
        pager: {
            visible: true,
            showInfo: true,
            showNavigationButtons: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 25, 50]
        },
        paging: {
            pageSize: 10
        },
        columnChooser:
        {
            enabled: true,
            mode: "select"
        },
        grouping: {
            autoExpandAll: true
        },
        filterRow: {
            visible: false,
            applyFilter: "auto"
        },
        headerFilter: {
            visible: false
        }
    };

    const ext = $.extend({}, dxGridCommonOptions, options);

    return $(`#${component.id}`).dxDataGrid(ext).dxDataGrid('instance');
}

function DxFileUpload(component, options) {
    DxRestart(component.id, 'dxFileUploader');

    const dxCommon = {
        selectButtonText: component.description,
        accept: '*',
        uploadMode: 'useForm',
        multiple: false
    };
    const ext = $.extend({}, dxCommon, options);

    return $(`#${component.id}`).dxFileUploader(ext).dxFileUploader('instance');
}

function DxToast(component, options) {
    DxRestart(component.id, 'dxToast');

    const dxCommon = {
        position: {
            my: 'center',
            at: 'center',
            offset: "0 0"
        },
        width: '350px',
        closeOnClick: true,
        closeOnOutsideClick: true,
        shadingColor: 'rgba(0, 0, 0, 0.5)'
    };
    const ext = $.extend({}, dxCommon, options);

    return $(`#${component.id}`).dxToast(ext).dxToast('instance');
}

function DxButton(component, options) {
    DxRestart(component.id, 'dxButton');

    const dxCommon = {
        text: component.text,
        stylingMode: 'contained',
        type: 'default'
    };
    const ext = $.extend({}, dxCommon, options);

    return $(`#${component.id}`).dxButton(ext).dxButton('instance');
}

function DxTagBox(component, options) {
    DxRestart(component.id, 'dxTagBox');

    const dxCommon = {
        dataSource: new DevExpress.data.ArrayStore({
            data: component.data,
            key: component.value
        }),
        displayExpr: component.description,
        valueExpr: component.value,
        showSelectionControls: true
    };
    const ext = $.extend({}, dxCommon, options);

    return $(`#${component.id}`).dxTagBox(ext).dxTagBox('instance');
}

function DxLoadPanel(component, options) {
    DxRestart(component.id, 'dxLoadPanel');

    const dxCommon = {
        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false
    };
    const ext = $.extend({}, dxCommon, options);

    return $(`#${component.id}`).dxLoadPanel(ext).dxLoadPanel('instance');
}

function DxValidator(widget, validation) {
    const rules = [
        { type: "required", message: "{field} é obrigatório." },
        { type: "numeric", message: "{field} deve ser numérico." },
        { type: "range", message: "{field} possui valor inválido." },
        { type: "stringLength", message: "O tamanho do campo {field} é inválido." },
        { type: "email", message: "E-mail inválido." }
    ];

    let mergeRules = rules.filter(x => (validation.rules || []).includes(x.type));
    mergeRules.forEach(item => {
        if (validation.name) {
            item.message = item.message.replace('{field}', validation.name);
        } else {
            item.message = item.message.replace('{field}', 'Este campo');
        }
    });

    const mergedRules = (validation.validationRules || []).concat(mergeRules);

    validation.validationRules = mergedRules;

    widget.dxValidator(validation);
}

function CheckAndSetValues(components, values) {
    values.map((item, i) => {
        if (item) {
            components[i].option('value', item);
        }
    });
}

function ShowLoadPanel(pMessage, visible) {
    if (typeof visible !== "boolean") {
        visible = true;
    }

    $("#loadPanel").dxLoadPanel({
        message: pMessage,
        showIndicator: true,
        shading: true,
        shadingColor: "rgba(0,0,0,0.5)",
        visible: visible
    });
}

// Padrão de exibição de mensagens Toast
function ShowMessage(pType, pMessage, pTime) {

    if (pMessage) {
        message = DxToast({ id: 'message' }, {
            message: pMessage,
            type: pType,
            displayTime: pTime || 5000
        });
        console.log(pMessage);
        message.show();
    }
}

// Função Genérica para ocultar colunas durante o processo de exportação
function GridExportHide(fields) {
    var self = this;
    self.fields = fields;

    self.onExporting = function (e) {
        e.component.beginUpdate();
        for (var i = 0; i < self.fields.length; i++)
            e.component.columnOption(self.fields[i], "visible", false);
    };

    self.onExported = function (e) {
        for (var i = 0; i < self.fields.length; i++) {
            e.component.columnOption(self.fields[i], "visible", true);
            e.component.endUpdate();
        }
    };
}

function ShowMessageDelete() {
    ShowMessage('warning', 'Exclusão cancelada pelo usuário');
}

function DialogMessageCompose(message, type, custom) {

    let iconColor = "";
    let typeIcon = "";

    switch (type) {
        case 'success':
            iconColor = "#00A65A";
            typeIcon = "glyphicon glyphicon-ok-sign";
            break;
        case 'error':
            iconColor = "#F56954";
            typeIcon = "glyphicon glyphicon-remove-sign";
            break;
        case 'warning':
            iconColor = "#FF851B";
            typeIcon = "glyphicon glyphicon-exclamation-sign";
            break;
        case 'info':
            iconColor = "#39CCCC";
            typeIcon = "glyphicon glyphicon-info-sign";
            break;
        case 'question':
            iconColor = "#3C8DBC";
            typeIcon = "glyphicon glyphicon-question-sign";
            break;
        default:
            if (custom) {
                typeIcon = custom.icon;
                iconColor = custom.color;
                break;
            }

            iconColor = "#3C8DBC";
            typeIcon = "minus";
    }

    return `
            <div style="font-size: 60px; text-align: center; color: ${iconColor} ">
                <i class="${typeIcon}"></i>
            </div>
            <div style="font-size:20px;text-align:center; ">
                ${message}
            </div>
           `;
}

// Exibição de diálogos, parâmetro confirmDialog do tipo bool é requerido e indica se utilizará confirmação com dois botões
// default botõe: [Sim] e [Não] para confirmDialog = true e [OK] para confirmDialog = false
function ShowDialog(message, acao, type, title, textConfirm, textDecline, custom) {

    let buttons = [];

    let buttonOption = {
        text: type === DialogTypes.question ? textDecline || 'Não' : textConfirm || 'OK',
        onClick: () => false,
        onInitialized: () => {
            $('.dx-popup-normal').on('keydown', (event) => {
                if (event.key === "Escape" && acao) {
                    acao(false);
                    return;
                }
            });
        }
    }
    if (type === DialogTypes.question) {
        buttons = [
            {
                text: textConfirm || 'Sim',
                onClick: () => true,
                visible: true
            },
            buttonOption
        ];
    } else {
        buttons = [
            buttonOption
        ];
    }

    DevExpress.ui.dialog.custom({
        title: title || 'PortalRH',
        dragEnabled: true,
        messageHtml: DialogMessageCompose(message, type, custom),
        buttons: buttons
    }).show().done((acao));
}