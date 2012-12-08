// Extract Query string to find number of cells per row

var query = window.location.search;
if( query.substring(0, 1) == '?' ){
    query = query.substring(1);
}
if( ! query.length ){
    query = 'auto';
}
// query now contains number of cells....

function createNewGame(query){
    // Config
    this.HOLD_TIMEOUT_MS = 500; // 1000 MiliSecond for hold timeout
    
    // 
    var numCols, numRows;
    if(query == 'auto'){
        numCols = Math.floor( 12/320 * $(window).width() );
        numRows = Math.floor( 18/480 * $(window).height() );
    }else{
        query = query.split(',');
        numRows = parseInt( query[0] ) ;
        numCols = parseInt( query[1] );
    }
    // Create Game Object
//    console.log('Field size: ' , numRows, numCols);
    var gameOb = new Minesweeper( numRows, numCols );
    gameOb.start();

    
    // BIND EVENTS /////////////////////////////////


    var downTimer;
    var holdEventOccured =false;
    
    var longTapped = false;
    
    $('.cell').tap(function(event){
        if( longTapped ){
            return;
        }
        
        // HANDLE REGULAR CLICK
        // Return if game over
        if( !gameOb.isGameValid ){
            return;
        }

        var cellID = $(this).attr('id');
        cellID = cellID.split( gameOb.rcJoiner );
        var row = parseInt( cellID[0] );
        var col = parseInt( cellID[1] );
        gameOb.handleNormalClick(row, col);
    });
    
    $('.cell').taphold(function(event){
        longTapped = true;
        setTimeout(function(){
            longTapped = false;
        }, 500);
        
        // HANDLE SPECIAL CLICK
        
        // Return if game over
        if( !gameOb.isGameValid ){
            return;
        }

        var cellID = $(this).attr('id');
        cellID = cellID.split( gameOb.rcJoiner );
        var row = parseInt( cellID[0] );
        var col = parseInt( cellID[1] );
        gameOb.handleSpecialClick(row, col);
    });

    // Bind single & Right clicks event on a cell
    $('.cell').mouseup(function (event){
        
        // Return if game over
        if( !gameOb.isGameValid ){
            return;
        }

        var cellID = $(this).attr('id');
        cellID = cellID.split( gameOb.rcJoiner );
        var row = parseInt( cellID[0] );
        var col = parseInt( cellID[1] );
        
        // detect which click/hold event?
        
        switch( event.which ){
            case 3:
                // Double-click
                gameOb.handleSpecialClick(row, col);
                break;
            default:
//                gameOb.updateStatus("Nothing to do " + event.which);
                break;
        }
        
        event.preventDefault();
        event.stopPropagation();
    });
    
    

    // Disable right click
    $('.cell').bind("contextmenu", function(e) {
        return false;
    });
    
    // Prevent default behavior on Android
        
    function absorbEvent_(event) {
        var e = event || window.event;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }
    
    function preventLongPressMenu(elem) {
        elem.ontouchstart = absorbEvent_;
        elem.ontouchmove = absorbEvent_;
        elem.ontouchend = absorbEvent_;
        elem.ontouchcancel = absorbEvent_;
    }
    
    $('.cell').bind('ontouchstart', absorbEvent_);
    $('.cell').bind('ontouchmove', absorbEvent_);
    $('.cell').bind('ontouchend', absorbEvent_);
    $('.cell').bind('ontouchcancel', absorbEvent_);
    
    //    preventLongPressMenu(document.getElementById('theimage'));
    
    // do with the stopwatch
    $('#clock').stopwatch();
    
    gameOb.updateStatus("Hold your click for flag!")
}




// Bind new Game

$('#newGameBtn').click(function(){
    createNewGame(query);
});

$('#menuBtn').click(function(){
    window.location = 'index.html';
});


// Auto-start a new game
createNewGame(query);
