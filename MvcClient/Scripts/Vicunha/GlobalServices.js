var urlApplication = window.location.protocol + "//" + window.location.host;
var urlRequestApi = '/Gateway/RequestApi';
var urlDownloadFile = '/Gateway/DownloadFile';

function AjaxRequestApi(data, success, error) {

    ShowLoadPanel();
    return $.ajax({
        type: "POST",
        url: urlApplication + urlRequestApi,
        data: data,
        dataType: "json",
        success: success,
        error: error
    });
}

// Saude Seguranca Configuration
function SaudeSegurancaPost(data, success, error) {
    if (data) {
        data['type'] = 'POST';
        data['service'] = 'SaudeSeguranca';        
    }

    return AjaxRequestApi(data, success, error);
}

function SaudeSegurancaPostByte(data, success, error) {
    if (data) {
        data['type'] = 'POSTBYTE';
        data['service'] = 'SaudeSeguranca';
    }

    return AjaxRequestApi(data, success, error);
}

function SaudeSegurancaGet(data, success, error) {
    if (data) {
        data['type'] = 'GET';
        data['service'] = 'SaudeSeguranca';
    }

    return AjaxRequestApi(data, success, error);
}

function SaudeSegurancaPut(data, success, error) {
    if (data) {
        data['type'] = 'PUT';
        data['service'] = 'SaudeSeguranca';        
    }

    return AjaxRequestApi(data, success, error);
}

function SaudeSegurancaDelete(data, success, error) {
    if (data) {
        data['type'] = 'DELETE';
        data['service'] = 'SaudeSeguranca';
    }

    return AjaxRequestApi(data, success, error);
}

// AppServer Configuration
function AppServerPost(data, success, error) {
    if (data) {
        data['type'] = 'POST';
        data['service'] = 'AppServer';
        AjaxRequestApi(data, success, error);
    }  
}

function AppServerDownloadFile(data, success, error) {
    if (data) {
        data['type'] = 'POST';
        data['service'] = 'AppServer';
        
        ShowLoadPanel();
        $.ajax({
            type: 'POST',
            url: urlApplication + urlDownloadFile,
            data: data,
            dataType: 'json',
            success: success,
            error: error
        });

    }
}

function AppServerGet(data, success, error) {
    if (data) {
        data['type'] = 'GET';
        data['service'] = 'AppServer';
        AjaxRequestApi(data, success, error);
    }
}

// Requisições para as controllers
function Post(url, data, success, error, loadMsg) {
    ShowLoadPanel(loadMsg);
    return $.ajax({
        type: 'POST',
        url: urlApplication + url,
        data: data,
        dataType: 'json',
        success: success,
        error: error
    });
}

function Get(url, data, success, error, loadMsg) {

    ShowLoadPanel(loadMsg);
    $.ajax({
        type: 'GET',
        url: urlApplication + url,
        data: data,
        dataType: 'json',
        success: success,
        error: error
    });
}