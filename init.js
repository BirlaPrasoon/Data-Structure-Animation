$(document).ready(function(){

    init();

})

function init(){
    initDrawDiv();
    initAnimationControls();
    initHistoryDiv();
    initSpeedControllers();
    initDSControls();

    console.log('init clicked');

    var c = new btv.BinarySearchTreeController(document.getElementById("controlDiv"), document.getElementById("drawDiv"));
}

function initDrawDiv(){

    var drawDiv = document.getElementById('drawDiv');
    drawDiv.innerHTML = '';

}

function initSpeedControllers(){

    var speedControllersDiv = document.getElementById('speed-controllers');

    speedControllersDiv.innerHTML = 

    '<div  class="item col"> Speed of move: '+
        '<div id="moveSpeedSlider" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" aria-disabled="false">'+
            '<a class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="left: 16.6667%;"></a>'+
        '</div>'+
    '</div>'+
    '<div class="item col">Duration of a step:'+
        '<div id="stepDurationSlider" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" aria-disabled="false">'+
            '<a class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="left: 28.9474%;"></a>'+
        '</div>'+
    '</div>';

}

function initAlgoDiv(){

   var algoDiv = document.getElementById('algorithmsDiv');
   algoDiv.innerHTML = 
   ' <div id="algorithmsDiv">'+
   '<div id="algorithmsLegend" class="legend row justify-content-center " style="margin: 10px;"><h5>Algorithms</h5></div>'+
   
   '<div class="algo-button-div">'+
       '<form id="BSTRandomBSTreeForm" class="row " action="javascript:btv.controller.randomBSTreeButton()">'+
           '<input class="col-6 algo-button" id="BSTRandomBSTreeButton" type="submit" value="Random BSTree">&nbspmin : &nbsp '+ 
           '<input class="col-auto inputBox" id="BSTRandomBSTreeMinText" type="text" value="0" size="1">&nbspmax : &nbsp'+
           '<input class="col-auto inputBox" id="BSTRandomBSTreeMaxText" type="text" value="99" size="1">'+
       '</form>'+
   '</div>'+

   '<div class="algo-button-div">'+
       '<form id="BSTInsertForm" class="row " action="javascript: btv.controller.insertButton()">'+
          '<input id="BSTInsertButton" class="col-8 algo-button" type="submit" value="Insert">&nbsp&nbsp&nbsp&nbsp value : &nbsp&nbsp'+
           '<input id="BSTInsertText" class="col-auto inputBox align-self-end" type="text" size="1">'+
       '</form>'+
   '</div>'+
   
   '<div class="algo-button-div">'+
       '<form id="BSTFindForm" class="row" action="javascript:btv.controller.findButton()">'+
           '<input id="BSTFindButton" class="col-8 algo-button" type="submit" value="Find">&nbsp&nbsp&nbsp&nbsp value : &nbsp&nbsp '+
           '<input id="BSTFindText" class="col-auto inputBox" type="text" size="1"> '+
       '</form>'+
   '</div>'+
   
   '<div class="algo-button-div">'+
       '<form id="BSTDeleteForm" class="row" action="javascript:btv.controller.deleteButton()">'+
           '<input id="BSTDeleteButton" class="col algo-button" type="submit" value="Delete"></form>'+
   '</div>'+
   
   '<div class="algo-button-div">'+
       '<form id="BSTGetMaxForm" class="row" action="javascript:btv.controller.getMaxButton()">'+
           '<input id="BSTGetMaxButton" class="col algo-button" type="submit" value="Get Max"></form>'+
   '</div>'+
   
   '<div class="algo-button-div">'+
       '<form id="BSTGetMinForm" class="row" action="javascript:btv.controller.getMinButton()">'+
           '<input id="BSTGetMinButton" class="col algo-button" type="submit" value="Get Min"></form>'+
   '</div>'+
   
   '<div class="algo-button-div">'+
       '<form id="BSTGetPredecessorForm" class="row" action="javascript:btv.controller.getPredecessorButton()">'+
           '<input id="BSTGetPredecessorButton" class="col algo-button" type="submit" value="Get Predecessor"></form>'+
   '</div>'+
   
   '<div class="algo-button-div">'+
       '<form id="BSTGetSuccessorForm" class="row" action="javascript:btv.controller.getSuccessorButton()">'+
           '<input id="BSTGetSuccessorButton" class="col algo-button"  type="submit" value="Get Successor"></form>'+
   '</div>'+
   
   '<div class="algo-button-div">'+
       '<form id="BSTToPreorderArrayForm" class="row"  action="javascript:btv.controller.toPreorderArrayButton()">'+
           '<input id="BSTToPreorderArrayButton" class="col  algo-button" type="submit" value="To Preorder Array">'+
       '</form>'+
   '</div>'+
   
   '<div class="algo-button-div">'+
       '<form id="BSTToInorderArrayForm" class="row " action="javascript:btv.controller.toInorderArrayButton()">'+
           '<input id="BSTToInorderArrayButton" class="col algo-button" type="submit" value="To Inorder Array">'+
       '</form>'+
   '</div>'+
  
   '<div class="algo-button-div">'+
           '<form id="BSTToPostorderArrayForm" class="row" action="javascript:btv.controller.toPostorderArrayButton()">'+
           '<input id="BSTToPostorderArrayButton" class="col algo-button" type="submit" value="To Postorder Array">'+
       '</form>'+
   '</div>'+
'</div>'; 

}

function initDSControls(){
    
    var div = document.getElementById('dataStructure');
    div.innerHTML = 
    '<div id="ds_selectDIV" class="col"> '+
        '<div class="col justify-content-center" >Data Structure</div>'+
        '<select name="Data Structures" id="select" class="col"></select>'+
    '</div>'+
    '<div id="ds_operationsDIV" class="col"> '+
        '<div class="col justify-content-center" >Operations</div>'+
        '<select name="DS_operations" id="operations" class="col"></select>'+
    '</div>'+
    '<div id="picked_algo"></div>';    

    var ds_options =  ['BST'];
    inflateSelect('select', ds_options);

}


function changePickedAlgoContent(str){
    var html = '';
    switch(str){


    case 'Generate Random BST ':
        html = '<div class="algo-button-div col">'+
                        '<form id="BSTRandomBSTreeForm" class="row " action="javascript:btv.controller.randomBSTreeButton()">'+
                            '<input class="col-4 algo-button" id="BSTRandomBSTreeButton" type="submit" value="Random BST">&nbspmin : &nbsp '+ 
                            '<input class="col-auto inputBox" id="BSTRandomBSTreeMinText" type="text" value="0" size="1">&nbspmax : &nbsp'+
                            '<input class="col-auto inputBox" id="BSTRandomBSTreeMaxText" type="text" value="99" size="1">'+
                        '</form>'+
                    '</div>';
        break;
    case 'Insert ':
        
        html = '<div class="algo-button-div col">'+
                        '<form id="BSTInsertForm" class="row " action="javascript: btv.controller.insertButton()">'+
                            '<input id="BSTInsertButton" class="col-7 algo-button" type="submit" value="Insert">&nbsp&nbsp&nbsp&nbsp value : &nbsp&nbsp'+
                            '<input id="BSTInsertText" class="col-auto inputBox align-self-end" type="text" size="1">'+
                        '</form>'+
                    '</div>';
        break;
    case 'Find ':

        html =  '<div class="algo-button-div col">'+
                    '<form id="BSTFindForm" class="row" action="javascript:btv.controller.findButton()">'+
                        '<input id="BSTFindButton" class="col-7 algo-button" type="submit" value="Find">&nbsp&nbsp&nbsp&nbsp value : &nbsp&nbsp '+
                        '<input id="BSTFindText" class="col-auto inputBox" type="text" size="1"> '+
                    '</form>'+
                '</div>';
        break;
    
    case 'Delete ':
                // html = '<div class="algo-button-div col">'+
                //             '<form id="BSTDeleteForm" class="row" action="javascript:btv.controller.deleteButton()">'+
                //                 '<input id="BSTDeleteButton" class="col algo-button" type="submit" value="Delete"></form>'+
                //         '</div>';
                html =  '<div class="algo-button-div col">'+
                            '<form id="BSTFindForm" class="row" action="javascript:btv.controller.deleteButton()">'+
                                '<input id="BSTDeleteButton" class="col-7 algo-button" type="submit" value="Delete">&nbsp&nbsp&nbsp&nbsp value : &nbsp&nbsp '+
                                '<input id="BSTDeleteText" class="col-auto inputBox" type="text" size="1"> '+
                            '</form>'+
                        '</div>';
    break;

    case 'Get Max ':
                html = '<div class="algo-button-div col">'+
                            '<form id="BSTGetMaxForm" class="row" action="javascript:btv.controller.getMaxButton()">'+
                                '<input id="BSTGetMaxButton" class="col algo-button" type="submit" value="Get Max"></form>'+
                                '<small>(of selected/Root node)'+
                        '</div>';

    break;

    case 'Get Min ':

                html = '<div class="algo-button-div col">'+
                            '<form id="BSTGetMinForm" class="row" action="javascript:btv.controller.getMinButton()">'+
                                '<input id="BSTGetMinButton" class="col algo-button" type="submit" value="Get Min"></form>'+
                                '<small>(of selected/Root node)'+
                        '</div>';
    break;
    
    case 'Get Predecessor ':
                html = '<div class="algo-button-div col">'+
                            '<form id="BSTGetPredecessorForm" class="row" action="javascript:btv.controller.getPredecessorButton()">'+
                                '<input id="BSTGetPredecessorButton" class="col algo-button" type="submit" value="Get Predecessor"></form>'+
                                '<small>(of selected/Root node)'+
                        '</div>';

    break;

    case 'Get Successor ':
                html = '<div class="algo-button-div col">'+
                            '<form id="BSTGetSuccessorForm" class="row" action="javascript:btv.controller.getSuccessorButton()">'+
                                '<input id="BSTGetSuccessorButton" class="col algo-button"  type="submit" value="Get Successor"></form>'+
                                '<small>(of selected/Root node)'+
                        '</div>';

    break;

    case 'To Preorder Array ':
                html = '<div class="algo-button-div col">'+
                            '<form id="BSTToPreorderArrayForm" class="row"  action="javascript:btv.controller.toPreorderArrayButton()">'+
                                '<input id="BSTToPreorderArrayButton" class="col  algo-button" type="submit" value="To Preorder Array">'+
                            '</form>'+
                        '</div>';

    break;

    case 'To Inorder Array ' :
                html = '<div class="algo-button-div col">'+
                            '<form id="BSTToInorderArrayForm" class="row " action="javascript:btv.controller.toInorderArrayButton()">'+
                                '<input id="BSTToInorderArrayButton" class="col algo-button" type="submit" value="To Inorder Array">'+
                            '</form>'+
                        '</div>';

    break; 

    case 'To Postorder Array ' :
                html = '<div class="algo-button-div col">'+
                            '<form id="BSTToPostorderArrayForm" class="row" action="javascript:btv.controller.toPostorderArrayButton()">'+
                            '<input id="BSTToPostorderArrayButton" class="col algo-button" type="submit" value="To Postorder Array">'+
                        '</form>'+
                    '</div>';
    break;
    default:
        console.log('change content error');
    }

    changeDivHTML('picked_algo', html);
}


function removeOptions(selectbox){
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}

function changeDivHTML(id, html){
    var div = document.getElementById(id);
    div.innerHTML = html;
}


function inflateSelect(selectId,options) {
                
    var select = document.getElementById(selectId);
    console.log(select);
    console.log('inflate select: ' + selectId);
    removeOptions(select);

    options.forEach(function(value, index, arr) {
        var option = document.createElement('option');
        option.text = value;
            try{select.add(option,select.options[null]);}
            catch (e){select.add(option,null);}
    });

}




function initAnimationControls(){

    var animationDiv = document.getElementById('animationDiv');

    animationDiv.innerHTML = 
    
    '<div id="animationButtons" class="item col-7 m-auto row">' +
    
        '<button id="startOver" class="media-button m-auto" disabled="" ' +  
                'role="button" aria-disabled="true" title="Start Over">' +
                '<i class="fas fa-redo-alt fa-3x media-icon"></i> ' +
        '</button> ' +

        '<button id="previousButton" class="media-button m-auto" disabled="" ' +  
                'role="button" aria-disabled="true" title="Previous">' +
                '<i class="fas fa-arrow-circle-left fa-3x media-icon"></i> ' +
        '</button> ' +
        
        '<button id="skipBackwardButton" class="media-button m-auto" disabled="" ' +
                'role="button" aria-disabled="true" title="Skip Backward" > ' +
                '<i class="fas fa-backward fa-3x media-icon" ></i> ' +           
        '</button>' +
        
        '<button id="playPauseButton" class="media-button m-auto" disabled=""  role="button" aria-disabled="true" title="Play" > ' +
                '<i class="far fa-play-circle fa-3x media-icon"></i> ' +
        '</button> ' +
        
        '<button id="skipForwardButton" class="media-button m-auto" disabled=""  role="button" aria-disabled="true" title="Skip Forward" > ' +
                '<i class="fas fa-forward fa-3x media-icon"></i> ' +
        '</button> ' +
        
        '<button id="nextButton" class="media-button m-auto" disabled="" role="button" aria-disabled="true" title="Next" > ' +
                '<i class="fas fa-arrow-circle-right fa-3x media-icon"></i> ' +
        '</button> ' +
    '</div> ' +
    '<div class="col align-content-center"> ' +
    '<input id="continuouslyCheckbox" type="checkbox" checked="checked" >' +
    '<label for="continuouslyCheckbox" class="m-auto">Continuously</label> ' +
    '</div>';


}


function initHistoryDiv(){
    var historyDiv = document.getElementById('historyDiv');
    historyDiv.innerHTML = 
    '<form id="historyForm" action="javascript:btv.controller.redoSelectedButton()" style="width: 100%">'+
        '<div >'+
            '<select id="historySelect" ondblclick="btv.controller.redoSelectedButton(); class="browser-default custom-select custom-select-lg mb-3" multiple style="width:100%; height:340px">'+
            '</select>'+
        '</div>'+
    '</form>';

}


function showNotification(notification) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    var snackbarDiv = document.getElementById('snackbar');
    snackbarDiv.innerHTML = notification;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }