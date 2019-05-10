
/**
 * On load functions.
 */
window.onload = function() {
    createAnchors();

    initMediaButtons();
}

/**
 * Create anchors from HTMLelements (headlines) with class="anchor".
 */
function createAnchors() {
    var anchors = document.getElementsByClassName("anchor");
    
    var anchor;
    for(var i=0; i < anchors.length; i++) {
                    
        anchor = "#" + anchors[i].id;
        anchors[i].innerHTML = "" +
            '<span style="cursor: hand; cursor: pointer;" ' + 
            'onclick="javascript:window.location.href = \'' + anchor + '\';">' + anchors[i].innerHTML +
            '</span>';
    }
}


/**
 * Create anchors from HTMLelements (headlines) with class="anchor".
 */
function initMediaButtons() {
    var contentDiv = document.getElementsById("content");
    contentDiv.addClass('container');
    this.controlsDiv.animationDiv = document.createElement("div");

    contentDiv.appendChild()
    
}




/**
 * Edit #algorithmsDiv div height.
 */
function setAlgorithmDivHeight() {
    var AlgDiv = document.getElementById("algorithmsDiv");
    
    if(AlgDiv) {
        var height = 600;
        
        height -= document.getElementById("animationDiv").offsetHeight;
        height -= document.getElementById("historyDiv").offsetHeight;
        //height -= document.getElementById("problemDiv").offsetHeight;  
    
        AlgDiv.style.height = (height-12) + "px";
    }
}
