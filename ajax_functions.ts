
export function ajaxGet(url, whatToDoWithResponseText){
	ajaxRequest(url, "GET", whatToDoWithResponseText);
}


export function ajaxPost(url, whatToDoWithResponseText){
	ajaxRequest(url, "POST", whatToDoWithResponseText);
}


export function ajaxRequest(url, getOrPost, whatToDoWithResponseText) {
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			whatToDoWithResponseText(this.responseText);
		}
	};
	xhttp.open(getOrPost, url, true);
	xhttp.send();
}
