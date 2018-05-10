"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ajaxGet(url, whatToDoWithResponseText) {
    ajaxRequest(url, "GET", whatToDoWithResponseText);
}
exports.ajaxGet = ajaxGet;
function ajaxPost(url, whatToDoWithResponseText) {
    ajaxRequest(url, "POST", whatToDoWithResponseText);
}
exports.ajaxPost = ajaxPost;
function ajaxRequest(url, getOrPost, whatToDoWithResponseText) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            whatToDoWithResponseText(this.responseText);
        }
    };
    xhttp.open(getOrPost, url, true);
    xhttp.send();
}
exports.ajaxRequest = ajaxRequest;
